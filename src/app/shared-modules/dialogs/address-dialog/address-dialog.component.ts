import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Address } from '../../../feature-modules/model';
import * as _ from 'lodash';

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
              @Inject(MAT_DIALOG_DATA) public data: {model: Address}) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [this.data.model.id, []],
      firstName: [this.data.model.firstName, [Validators.required]],
      lastName: [this.data.model.lastName, [Validators.required]],
      street: [this.data.model.street, [Validators.required]],
      city: [this.data.model.city, [Validators.required]],
      state: [this.data.model.state, []],
      zip: [this.data.model.zip, []],
    });
  }

  close() {
    const model: Address = _.cloneDeep(this.data.model);
    Object.assign(model, this.form.value);
    this.dialogRef.close(model);
  }
}
