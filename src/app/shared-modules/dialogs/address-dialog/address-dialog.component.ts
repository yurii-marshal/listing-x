import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Address } from '../../../core-modules/models/address';
import * as _ from 'lodash';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { AddressesService } from '../../../core-modules/core-services/addresses.service';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;

  constructor(private service: AddressesService,
              private formBuilder: FormBuilder,
              private snackbar: MatSnackBar,
              public dialogRef: MatDialogRef<AddressDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { model: Address, verbose: boolean }) {

    this.isEdit = !!data.model;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [this.data.model.id, []],
      firstName: [null, [Validators.required, Validators.maxLength(30)]],
      lastName: [null, [Validators.required, Validators.maxLength(150)]],
      streetName: [null, [Validators.required]],
      city: [null, [Validators.required, Validators.maxLength(255)]],
      state: [{value: 'California', disabled: true}, [Validators.required, Validators.maxLength(150)]],
      zip: [null, [Validators.required, CustomValidators.number, Validators.maxLength(10)]],
      apn: [null, [CustomValidators.number]],
    });

    if (this.data.model) {
      this.patchFromValues();
    }
  }

  patchFromValues() {
    this.form.setValue({
      id: this.data.model.id,
      firstName: this.data.model.firstName,
      lastName: this.data.model.lastName,
      streetName: this.data.model.streetName,
      city: this.data.model.city,
      state: this.data.model.state,
      zip: this.data.model.zip,
      apn: this.data.model.apn
    });
  }

  close(): void {
    const model: Address = this.form.value;
    const message = `Successfully ${this.isEdit ? 'updated' : 'created new'} address.`;
    of(model)
      .pipe(
        switchMap(() => this.isEdit
          ? this.service.update(model)
          : this.service.add(model)
        ),
        // TODO: catch error
        tap(() => this.data.verbose && this.snackbar.open(message, null, {duration: 3000}))
      )
      .subscribe(() => this.dialogRef.close(model));
  }
}
