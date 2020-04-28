import { Component, Inject, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Address } from '../../../core-modules/models/address';
import * as _ from 'lodash';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { AddressesService } from '../../../core-modules/core-services/addresses.service';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import {Person} from '../../../core-modules/models/offer';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;

  get sellers(): FormArray {
    return this.form.get('sellers') as FormArray;
  }

  constructor(private service: AddressesService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private snackbar: MatSnackBar,
              public dialogRef: MatDialogRef<AddressDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { model: Address, verbose: boolean }) {

    this.isEdit = !!data.model;
  }

  ngOnInit() {
    const {firstName, lastName} = this.authService.currentUser;

    this.form = this.formBuilder.group({
      id: [null, []],
      firstName: [{value: firstName, disabled: true}, [Validators.required, Validators.maxLength(30)]],
      lastName: [{value: lastName, disabled: true}, [Validators.required, Validators.maxLength(150)]],
      sellers: this.formBuilder.array([this.buildSellers()]),
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

  private buildSellers(model?: Person): FormGroup {
    return this.formBuilder.group({
      id: [{value: model ? model.id : null, disabled: true}, []],
      firstName: [model ? model.firstName : null, Validators.required],
      lastName: [model ? model.lastName : null, Validators.required],
      email: [model ? model.email : null, [Validators.required, Validators.email]]
    });
  }

  patchFromValues() {
    const formControlNames: string[] = Object.keys(this.form.controls);
    const formData = _.pick(this.data.model, formControlNames);

    const {sellers} = formData;
    formData.sellers = [];

    this.form.patchValue(formData);

    const sellersFg: FormGroup[] = sellers.map((row) => this.buildSellers(row));

    this.form.setControl('sellers', this.formBuilder.array(sellersFg));
    this.form.markAsDirty();
  }

  close(): void {
    /* FIXME */
    const model: Address = {
      ...this.form.getRawValue(),
      sellers: this.form.value.sellers.map(r => ({...r, email: r.email.toLowerCase()}))
    }; // include disabled control
    const message = `Successfully ${this.isEdit ? 'updated' : 'created new'} address.`;
    of(model)
      .pipe(
        switchMap(() => this.isEdit
          ? this.service.update(model)
          : this.service.add(model)
        ),
        // TODO: catch error
        tap(() => this.data.verbose && this.snackbar.open(message))
      )
      .subscribe(() => this.dialogRef.close(model));
  }

  removeRow(i: number): void {
    this.sellers.removeAt(i);
  }

  addModerator(): void {
    this.sellers.push(this.buildSellers());
  }
}
