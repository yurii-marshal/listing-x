import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { OfferService } from '../../services/offer.service';
import { AuthService } from '../../../../core-modules/core-services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressService } from '../../../../core-modules/core-services/progress.service';
import { Offer, Person } from '../../../../core-modules/models/offer';
import { CustomValidators } from '../../../../core-modules/validators/custom-validators';
import * as _ from 'lodash';
import { switchMap, tap } from 'rxjs/operators';
import { LocalStorageKey } from '../../../../core-modules/enums/local-storage-key';
import { MatSnackBar } from '@angular/material';

enum Type {
  Moderators = 'moderators',
  Buyers = 'buyers',
  Sellers = 'sellers',
}

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {
  form: FormGroup;
  Type = Type;

  isLoading: Observable<boolean>;

  offerId: number;
  anonymousOffer: Offer;

  constructor(private formBuilder: FormBuilder,
              private offerService: OfferService,
              private authService: AuthService,
              private router: Router,
              private snackbar: MatSnackBar,
              private route: ActivatedRoute,
              private progressService: ProgressService,
  ) {
  }

  get buyers(): FormArray {
    return this.form.get('buyers') as FormArray;
  }

  get sellers(): FormArray {
    return this.form.get('sellers') as FormArray;
  }

  get moderators(): FormArray {
    return this.form.get('moderators') as FormArray;
  }

  private get predefinedUser() {
    return (this.authService.currentUser)
      ? this.createEntity(this.authService.currentUser, true)
      : this.createEntity();
  }

  ngOnInit() {
    this.offerService.offerProgress = 1;
    this.isLoading = this.progressService.processingStream;

    this.offerId = +this.route.snapshot.paramMap.get('id');
    this.anonymousOffer = this.route.snapshot.data.model as Offer;

    this.buildForm();

    if (this.anonymousOffer && !this.offerId) {
      this.form.markAsDirty(); // Allow to save immediately even user did't touch any field
    }
  }

  findOffers() {
  }

  setBuyerAsEntity() {
  }

  applyFormValues(model?: Offer): void {
    const names: string[] = Object.keys(this.form.controls);
    const formControlNames: string[] = _.without(names, 'buyers', 'sellers');
    const formData = _.pick(model, formControlNames);
    this.form.patchValue(formData);

    // Nested forms
    if (!_.isEmpty(model.buyers)) {
      const buyers = _.map(model.buyers, (item: Person, i: number) => this.createEntity(item, true));
      this.form.setControl('buyers', this.formBuilder.array(buyers));
    }

    if (!_.isEmpty(model.sellers)) {
      const sellers = _.map(model.sellers, item => this.createEntity(item, true));
      this.form.setControl('sellers', this.formBuilder.array(sellers));
    }

    if (model.moderators && model.moderators.length) {
      const mb = model.moderators.map((item) => this.createEntity(item, true));
      this.form.setControl('moderators', this.formBuilder.array(mb));
    }

    if (this.anonymousOffer && !this.offerId) {
      this.form.get('sellers').disable();
    }
  }

  createEntity(model?: Person, disabled: boolean = false): FormGroup {
    const formGroup = this.formBuilder.group({
      firstName: [{value: model && model.firstName, disabled}, [Validators.required, Validators.maxLength(30)]],
      lastName: [{value: model && model.lastName, disabled}, [Validators.required, Validators.maxLength(150)]],
      email: [{value: model && model.email, disabled}, [Validators.required, Validators.email]], // CustomValidators.unique(this.)
    });

    if (model) {
      formGroup.patchValue(model);
    }

    return formGroup;
  }

  add(type: Type): void {
    const control = this.form.get(type) as FormArray;
    control.push(this.createEntity());
  }

  remove(type: Type, index: number): void {
    const control = this.form.get(type) as FormArray;
    control.removeAt(index);
  }

  submit(): void {
    const model: Offer = {
      ...this.form.getRawValue(),
      moderators: this.moderators.getRawValue().map(i => ({...i, email: i.email.toLowerCase()})),
      sellers: this.sellers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()})),
      buyers: this.buyers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()}))
    } as Offer; // to include 'state'

    const message = `Successfully ${this.offerId ? 'updated' : 'created new'} offer.`;

    of(model)
      .pipe(
        switchMap((item: Offer) => this.storeFormData(item)),
        tap(() => this.snackbar.open(message))
      )
      .subscribe(({id}) => {
        console.log(id);
        // this.router.navigate([`/purchase-agreement/${id}/step-two`]);
      });
  }

  private buildForm(): void {
    const disabled: boolean = !!this.anonymousOffer;

    this.form = this.formBuilder.group({
      id: [this.offerId || null, []],
      moderators: this.formBuilder.array([this.predefinedUser]),
      buyers: this.formBuilder.array([this.createEntity()]),
      sellers: this.formBuilder.array([this.createEntity()]),
      streetName: [{value: disabled && this.anonymousOffer.streetName, disabled}, [Validators.required]],
      city: [{value: disabled && this.anonymousOffer.city, disabled}, [Validators.required, Validators.maxLength(255)]],
      state: [{value: 'California', disabled: true}, [Validators.required, Validators.maxLength(150)]],
      zip: [
        {value: disabled && this.anonymousOffer.zip, disabled},
        [Validators.required, CustomValidators.number, Validators.maxLength(10)]
      ],
      apn: [{value: disabled && this.anonymousOffer.apn, disabled}, [CustomValidators.number]],
    });

    if (this.anonymousOffer) {
      this.applyFormValues(this.anonymousOffer);
    }
  }

  // Prevent redundant call to api in case form didn't touch
  private storeFormData(item: Offer): Observable<Offer> {
    if (this.form.dirty) {
      return this.offerId
        ? this.offerService.update(item)
        : this.offerService.add(item);
    } else {
      return of(item);
    }
  }
}
