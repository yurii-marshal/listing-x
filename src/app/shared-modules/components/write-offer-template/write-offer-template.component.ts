import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Offer, Person } from '../../../core-modules/models/offer';
import { OfferService } from '../../../feature-modules/portal/services/offer.service';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { MatSnackBar } from '@angular/material';
import { ProgressService } from '../../../core-modules/core-services/progress.service';
import * as _ from 'lodash';
import { switchMap, tap } from 'rxjs/operators';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';

enum Type {
  Agents = 'agents',
  Buyers = 'buyers',
  Sellers = 'sellers',
}

@Component({
  selector: 'app-write-offer-template',
  templateUrl: './write-offer-template.component.html',
  styleUrls: ['./write-offer-template.component.scss']
})
export class WriteOfferTemplateComponent implements OnInit, OnDestroy {
  @Input() offer: Offer;

  @Input() anonymousOffer: Offer;

  @Output() offerSent: EventEmitter<Offer> = new EventEmitter();

  form: FormGroup;
  Type = Type;

  isLoading: Observable<boolean>;

  constructor(private formBuilder: FormBuilder,
              private offerService: OfferService,
              private authService: AuthService,
              private snackbar: MatSnackBar,
              private progressService: ProgressService,
  ) {
  }

  get buyers(): FormArray {
    return this.form.get('buyers') as FormArray;
  }

  get sellers(): FormArray {
    return this.form.get('sellers') as FormArray;
  }

  get agents(): FormArray {
    return this.form.get('agents') as FormArray;
  }

  private get predefinedUser() {
    return (this.authService.currentUser)
      ? this.createEntity(this.authService.currentUser, true)
      : this.createEntity();
  }

  ngOnInit() {
    this.isLoading = this.progressService.processingStream;

    this.buildForm();

    if (this.anonymousOffer || this.offer) {
      this.form.markAsDirty(); // Allow to save immediately even user did't touch any field
    }
  }

  ngOnDestroy() {
    this.offerService.changedOfferModel = this.form.value as Offer;
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
      const buyers = _.map(model.buyers, (item: Person, i: number) => this.createEntity(item, !!this.anonymousOffer));
      this.form.setControl('buyers', this.formBuilder.array(buyers));
    }

    if (!_.isEmpty(model.sellers)) {
      const sellers = _.map(model.sellers, item => this.createEntity(item, !!this.anonymousOffer));
      this.form.setControl('sellers', this.formBuilder.array(sellers));
    }

    if (model.agents && model.agents.length) {
      const mb = model.agents.map((item) => this.createEntity(item, !!this.anonymousOffer));
      this.form.setControl('agents', this.formBuilder.array(mb));
    }

    if (this.anonymousOffer && !this.offer) {
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
      agents: this.agents.getRawValue().map(i => ({...i, email: i.email.toLowerCase()})),
      sellers: this.sellers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()})),
      buyers: this.buyers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()}))
    } as Offer; // to include 'state'

    const message = `Successfully ${this.offer ? 'updated' : 'created new'} offer.`;

    of(model)
      .pipe(
        switchMap((item: Offer) => this.storeFormData(item)),
        tap(() => this.snackbar.open(message))
      )
      .subscribe((offer: Offer) => {
        this.offerSent.emit(offer);
      });
  }

  private buildForm(): void {
    const offerValues = this.anonymousOffer || this.offer;
    const disabled: boolean = !!this.anonymousOffer;

    this.form = this.formBuilder.group({
      id: [offerValues && offerValues.id || null, []],
      agents: this.formBuilder.array([this.predefinedUser]),
      buyers: this.formBuilder.array([this.createEntity()]),
      sellers: this.formBuilder.array([this.createEntity()]),
      streetName: [{value: offerValues ? offerValues.streetName : null, disabled}, [Validators.required]],
      city: [{value: offerValues ? offerValues.city : null, disabled}, [Validators.required, Validators.maxLength(255)]],
      state: [{value: 'California', disabled: true}, [Validators.required, Validators.maxLength(150)]],
      zip: [
        {value: offerValues ? offerValues.zip : null, disabled},
        [Validators.required, CustomValidators.number, Validators.maxLength(10)]
      ],
      apn: [{value: offerValues ? offerValues.apn : null, disabled}, [CustomValidators.number]],
    });

    if (offerValues) {
      this.applyFormValues(offerValues);
    }
  }

  // Prevent redundant call to api in case form didn't touch
  private storeFormData(item: Offer): Observable<Offer> {
    if (this.form.dirty) {
      return this.offer && this.offer.id
        ? this.offerService.update(item)
        : this.offerService.add(item);
    } else {
      return of(item);
    }
  }

}
