import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Address } from '../../../feature-modules/model';
import * as _ from 'lodash';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit {
  form: FormGroup;

  constructor(private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddressDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { model: Address }) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [this.data.model.id, []],
      firstName: [this.data.model.firstName, [Validators.required, Validators.maxLength(30)]],
      lastName: [this.data.model.lastName, [Validators.required, Validators.maxLength(150)]],
      street: [this.data.model.street, [Validators.required]],
      city: [this.data.model.city, [Validators.required, Validators.maxLength(255)]],
      state: [this.data.model.state, [Validators.required, Validators.maxLength(150)]],
      zip: [this.data.model.zip, [CustomValidators.number, Validators.maxLength(10)]],
      apn: [this.data.model.apn, [CustomValidators.number]],
    });
  }

  close() {
    const model: Address = _.cloneDeep(this.data.model);
    Object.assign(model, this.form.value);
    this.dialogRef.close(model);
  }
}
