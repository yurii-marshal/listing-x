import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { OfferService } from '../../services/offer.service';
import { AuthService } from '../../../../core-modules/core-services/auth.service';
import { Router } from '@angular/router';
import { ProgressService } from '../../../../core-modules/core-services/progress.service';
import { Offer, Person } from '../../../../core-modules/models/offer';
import { CustomValidators } from '../../../../core-modules/validators/custom-validators';
import * as _ from 'lodash';
import { switchMap } from 'rxjs/operators';
import { LocalStorageKey } from '../../../../core-modules/enums/local-storage-key';

enum Type {
  ModeratorSellers = 'moderatorSellers',
  ModeratorBuyers = 'moderatorBuyers',
  Buyers = 'buyers',
  Sellers = 'sellers',
}

enum OfferMode {
  AddAnonymous,
  CreateFromAnonymous,
  CreateFromScratch,
  Update
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

  constructor(private formBuilder: FormBuilder,
              private service: OfferService,
              private authService: AuthService,
              private router: Router,
              private progressService: ProgressService,
  ) {
  }

  get buyers(): FormArray {
    return this.form.get('buyers') as FormArray;
  }

  get sellers(): FormArray {
    return this.form.get('sellers') as FormArray;
  }

  get moderatorBuyers(): FormArray {
    return this.form.get('moderatorBuyers') as FormArray;
  }

  get moderatorSellers(): FormArray {
    return this.form.get('moderatorSellers') as FormArray;
  }

  // This flag means that user create new offer from anonymous data stored before
  // get isAnonymousCreation(): boolean {
  //   return this.data.isAnonymousCreation && this.data.model !== null;
  // }

  // private get predefinedBuyer() {
  //   return (this.data.isAnonymous)
  //     ? this.createEntity()
  //     : this.createEntity(this.authService.currentUser, !this.data.isAnonymous);
  // }

  ngOnInit() {
    this.isLoading = this.progressService.processingStream;

    this.buildForm();

    // if (this.isAnonymousCreation) {
    //   this.form.markAsDirty(); // Allow to save immediately even user did't touch any field
    // }
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

    if (model.moderatorBuyers.length) {
      const mb = model.moderatorBuyers.map((p) => this.createEntity(p, true));
      this.form.setControl('moderatorBuyers', this.formBuilder.array(mb));
    }

    if (model.moderatorSellers.length) {
      const ms = model.moderatorSellers.map((p) => this.createEntity(p, true));
      this.form.setControl('moderatorSellers', this.formBuilder.array(ms));
    }

    // if (this.data.model && this.data.isAnonymous) {
    //   this.form.get('sellers').disable();
    //   this.form.get('moderatorSellers').disable();
    // }
  }

  createEntity(model?: Person, disabled: boolean = false): FormGroup {
    const formGroup = this.formBuilder.group({
      // id: [null, []],
      firstName: [{value: null, disabled}, [Validators.required, Validators.maxLength(30)]],
      lastName: [{value: null, disabled}, [Validators.required, Validators.maxLength(150)]],
      email: [{value: null, disabled}, [Validators.required, Validators.email]], // CustomValidators.unique(this.)
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
    /* FIXME */
    const model: Offer = {
      ...this.form.getRawValue(),
      moderatorBuyers: this.moderatorBuyers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()})),
      moderatorSellers: this.moderatorSellers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()})),
      sellers: this.sellers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()})),
      buyers: this.buyers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()}))
    } as Offer; // to include 'state'
    // if (this.data.isAnonymous) {
      // this.dialogRef.close(model);
    //   return; // Exit
    // }

    // const message = `Successfully ${this.data.isEdit ? 'updated' : 'created new'} offer.`;
    of(model)
      .pipe(
        switchMap((item: Offer) => this.storeFormData(item)),
        // tap(() => this.data.verbose && this.snackbar.open(message))
      )
      .subscribe(({id}) => {
        // this.dialogRef.close(model);
        this.router.navigate(['/portal/offer', id, 'step-2']);
      });
  }

  onClose() {
    // this.dialogRef.close();
    // clear the local storage when canceling
    localStorage.removeItem(LocalStorageKey.Offer);
  }

  private buildForm(): void {
    // const disabled: boolean = this.data.isAnonymous || this.isAnonymousCreation;
    const disabled: boolean = false;
    this.form = this.formBuilder.group({
      id: [null, []],
      // moderatorBuyers: this.formBuilder.array([this.predefinedBuyer]),
      moderatorBuyers: this.formBuilder.array([]),
      moderatorSellers: this.formBuilder.array([this.createEntity()]),
      buyers: this.formBuilder.array([this.createEntity()]),
      sellers: this.formBuilder.array([this.createEntity()]),
      streetName: [{value: null, disabled}, [Validators.required]],
      city: [{value: null, disabled}, [Validators.required, Validators.maxLength(255)]],
      state: [{value: 'California', disabled: true}, [Validators.required, Validators.maxLength(150)]],
      zip: [{value: null, disabled}, [Validators.required, CustomValidators.number, Validators.maxLength(10)]],
      apn: [{value: null, disabled}, [CustomValidators.number]],
      price: [null, [Validators.required, CustomValidators.number]],
      closeEscrowDays: [null, [Validators.required, CustomValidators.number, Validators.max(999)]]
    });

    // if (this.data.model) {
    //   this.applyFormValues(this.data.model);
    // }
  }

  // Prevent redundant call to api in case form didn't touch
  private storeFormData(item: Offer): Observable<Offer> {
    if (this.form.dirty) {
      // return this.data.isEdit
      //   ? this.service.update(item)
      //   : this.service.add(item);
    } else {
      return of(item);
    }
  }
}
