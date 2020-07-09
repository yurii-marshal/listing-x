import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { Offer, Person } from '../../../core-modules/models/offer';
import { OfferService } from '../../../feature-modules/portal/services/offer.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { ProgressService } from '../../../core-modules/core-services/progress.service';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';

enum Type {
  AgentSellers = 'agentSellers',
  AgentBuyers = 'agentBuyers',
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
  selector: 'app-write-offer-dialog',
  templateUrl: './write-offer-dialog.component.html',
  styleUrls: ['./write-offer-dialog.component.scss']
})
export class  WriteOfferDialogComponent implements OnInit {
  form: FormGroup;
  Type = Type;

  isLoading: Observable<boolean>;

  get buyers(): FormArray {
    return this.form.get('buyers') as FormArray;
  }

  get sellers(): FormArray {
    return this.form.get('sellers') as FormArray;
  }

  get agentBuyers(): FormArray {
    return this.form.get('agentBuyers') as FormArray;
  }

  get agentSellers(): FormArray {
    return this.form.get('agentSellers') as FormArray;
  }

  // This flag means that user create new offer from anonymous data stored before
  get isAnonymousCreation(): boolean {
    return this.data.isAnonymousCreation && this.data.model !== null;
  }

  constructor(private formBuilder: FormBuilder,
              private service: OfferService,
              private authService: AuthService,
              private snackbar: MatSnackBar,
              private router: Router,
              private progressService: ProgressService,
              public dialogRef: MatDialogRef<WriteOfferDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { model: Offer, isAnonymous: boolean, isAnonymousCreation: boolean, isEdit: boolean}) {// TODO: refactor isAnonymous using enum
  }

  ngOnInit() {
    this.isLoading = this.progressService.processingStream;

    this.buildForm();

    if (this.isAnonymousCreation) {
      this.form.markAsDirty(); // Allow to save immediately even user did't touch any field
    }
  }

  private buildForm(): void {
    const disabled: boolean = this.data.isAnonymous || this.isAnonymousCreation;
    this.form = this.formBuilder.group({
      id: [null, []],
      agentBuyers: this.formBuilder.array([this.predefinedBuyer]),
      agentSellers: this.formBuilder.array([this.createEntity()]),
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

    if (this.data.model) {
      this.applyFormValues(this.data.model);
    }
  }

  private get predefinedBuyer() {
    return (this.data.isAnonymous)
       ? this.createEntity()
       : this.createEntity(this.authService.currentUser, !this.data.isAnonymous);
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

    if (model.agentBuyers.length) {
      const mb = model.agentBuyers.map((p) => this.createEntity(p, true));
      this.form.setControl('agentBuyers', this.formBuilder.array(mb));
    }

    if (model.agentSellers.length) {
      const ms = model.agentSellers.map((p) => this.createEntity(p, true));
      this.form.setControl('agentSellers', this.formBuilder.array(ms));
    }

    if (this.data.model && this.data.isAnonymous) {
      this.form.get('sellers').disable()
      this.form.get('agentSellers').disable();
    }
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
      agentBuyers: this.agentBuyers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()})),
      agentSellers: this.agentSellers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()})),
      sellers: this.sellers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()})),
      buyers: this.buyers.getRawValue().map(i => ({...i, email: i.email.toLowerCase()}))
    }; // to include 'state'
    if (this.data.isAnonymous) {
      this.dialogRef.close(model);
      return; // Exit
    }

    const message = `Successfully ${this.data.isEdit ? 'updated' : 'created new'} offer.`;
    of(model)
      .pipe(
        switchMap((item: Offer) => this.storeFormData(item)),
        // tap(() => this.data.verbose && this.snackbar.open(message))
      )
      .subscribe(({id}) => {
        this.dialogRef.close(model);
        this.router.navigate(['/portal/offer', id, 'step-2']);
      });
  }

  onClose() {
    this.dialogRef.close();
    // clear the local storage when canceling
    localStorage.removeItem(LocalStorageKey.Offer);
  }

  // Prevent redundant call to api in case form didn't touch
  private storeFormData(item: Offer): Observable<Offer> {
    if (this.form.dirty) {
      return this.data.isEdit
        ? this.service.update(item)
        : this.service.add(item);
    }  else {
      return of(item);
    }
  }
}
