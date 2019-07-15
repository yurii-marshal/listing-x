import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Address } from '../../../core-modules/models/address';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { Offer, Person } from '../../../core-modules/models/offer';
import { OfferService } from '../../../core-modules/core-services/offer.service';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

enum Type {
  Buyers  = 'buyers',
  Sellers  = 'sellers'
}

@Component({
  selector: 'app-write-offer-dialog',
  templateUrl: './write-offer-dialog.component.html',
  styleUrls: ['./write-offer-dialog.component.scss']
})
export class WriteOfferDialogComponent implements OnInit {
  form: FormGroup;
  Type = Type;

  get buyers(): FormArray {
    return this.form.get('buyers') as FormArray;
  }

  get sellers(): FormArray {
    return this.form.get('sellers') as FormArray;
  }

  constructor( private formBuilder: FormBuilder,
               private service: OfferService,
               private snackbar: MatSnackBar,
               public dialogRef: MatDialogRef<WriteOfferDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: {model: Offer, isEdit: boolean, verbose?: boolean}) {

    // TODO: retrieve from LS
  }

  ngOnInit() {
    const buyers = _.map(this.data.model.buyers, item => this.createEntity(item));
    const sellers = _.map(this.data.model.sellers, item => this.createEntity(item));
    this.form = this.formBuilder.group({
      id: [this.data.model.id, []],
      buyers: this.formBuilder.array(buyers),
      sellers: this.formBuilder.array(sellers),
      street: [this.data.model.streetName, [Validators.required]],
      city: [this.data.model.city, [Validators.required, Validators.maxLength(255)]],
      state: [{value: this.data.model.state, disabled: true}, [Validators.required, Validators.maxLength(150)]],
      zip: [this.data.model.zip, [Validators.required, CustomValidators.number, Validators.maxLength(10)]],
      apn: [this.data.model.apn, [CustomValidators.number]],
      price: [this.data.model.price, []],
      closeEscrowDays: [this.data.model.closeEscrowDays, []]
    });
  }

  createEntity(model?: any): FormGroup {
    // TODO: disabled state
    return this.formBuilder.group({
      firstName: [model.firstName, [Validators.required, Validators.maxLength(30)]],
      lastName: [model.lastName, [Validators.required, Validators.maxLength(150)]],
      email: [model.email, [Validators.required, Validators.email]], // CustomValidators.unique(this.)
    });
  }

  add(type: Type = Type.Buyers, model?: any) {
    const control = this.form.get(type) as FormArray;
    model = model || new Person();
    control.push(this.createEntity(model));
  }

  remove(type: Type, index: number) {
    const control = this.form.get(type) as FormArray;
    control.removeAt(index);
  }

  close(): void {
    const message = `Successfully ${this.data.isEdit ? 'updated' : 'created new'} offer.`;
    of(this.formData)
      .pipe(
        switchMap((item: Offer) => this.data.isEdit
          ? this.service.update(item)
          : this.service.add(item)
        ),
        tap(() => this.data.verbose && this.snackbar.open(message, null, {duration: 3000}))
      )
      .subscribe(() => this.dialogRef.close(this.formData));

    // TODO: serializeStepOne into LS
    // TODO: redirect depends on anonimous or not
  }

  private get formData() {
    const model: Offer = _.cloneDeep(this.data.model);
    Object.assign(model, this.form.value);
    model.buyers = _.map(this.buyers.value, item => Object.assign(new Person(), item));
    model.sellers = _.map(this.sellers.value, item => Object.assign(new Person(), item));
    return model;
  }
}
