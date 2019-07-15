import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Address } from '../../../feature-modules/model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';

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
  isEdit: boolean;
  Type = Type;

  get buyers(): FormArray {
    return this.form.get('buyers') as FormArray;
  }

  get sellers(): FormArray {
    return this.form.get('sellers') as FormArray;
  }

  constructor( private formBuilder: FormBuilder,
               private snackbar: MatSnackBar,
               public dialogRef: MatDialogRef<WriteOfferDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any) {

    this.isEdit = !!data.model;
    // TODO: retrieve from LS
  }

  ngOnInit() {
    const buyers = _.map(this.data.model.buyers || [{}], item => this.createEntity(item));
    const sellers = _.map(this.data.model.sellers, item => this.createEntity(item));
    this.form = this.formBuilder.group({
      id: [this.data.model.id, []],
      buyers: this.formBuilder.array(buyers),
      sellers: this.formBuilder.array(sellers),
      // street: [this.data.model.street, [Validators.required]],
      // city: [this.data.model.city, [Validators.required, Validators.maxLength(255)]],
      // state: [{value: this.data.model.state, disabled: true}, [Validators.required, Validators.maxLength(150)]],
      // zip: [this.data.model.zip, [Validators.required, CustomValidators.number, Validators.maxLength(10)]],
      // apn: [this.data.model.apn, [CustomValidators.number]],
    });
  }

  createEntity(model?: any): FormGroup {
    // TODO: disalbled state
    return this.formBuilder.group({
      firstName: [_.get(model, 'firstName', null), [Validators.required, Validators.maxLength(30)]],
      lastName: [_.get(model, 'lastName', null), [Validators.required, Validators.maxLength(150)]],
      email: [_.get(model, 'email', null), [Validators.required, Validators.email]],
    });
  }

  add(type: Type = Type.Buyers, model?: any) {
    const control = this.form.get(type) as FormArray;
    control.push(this.createEntity(model));
  }

  remove(type: Type, index: number) {
    const control = this.form.get(type) as FormArray;
    control.removeAt(index);
  }

  close(): void {
    const model: Address = _.cloneDeep(this.data.model);
    Object.assign(model, this.form.value);

    // TODO: serialize into LS
    // TODO: redirect depends on anonimous or not
  }

}
