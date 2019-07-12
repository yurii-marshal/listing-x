import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Address } from '../../../feature-modules/model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-write-offer-dialog',
  templateUrl: './write-offer-dialog.component.html',
  styleUrls: ['./write-offer-dialog.component.scss']
})
export class WriteOfferDialogComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean;


  constructor( private formBuilder: FormBuilder,
               private snackbar: MatSnackBar,
               public dialogRef: MatDialogRef<WriteOfferDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isEdit = !!data.model;
    // TODO: retrieve from LS
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [this.data.model.id, []],
      firstName: [this.data.model.firstName, [Validators.required, Validators.maxLength(30)]],
      lastName: [this.data.model.lastName, [Validators.required, Validators.maxLength(150)]],
      email: [null, [Validators.required, Validators.email]],
      // street: [this.data.model.street, [Validators.required]],
      // city: [this.data.model.city, [Validators.required, Validators.maxLength(255)]],
      // state: [{value: this.data.model.state, disabled: true}, [Validators.required, Validators.maxLength(150)]],
      // zip: [this.data.model.zip, [Validators.required, CustomValidators.number, Validators.maxLength(10)]],
      // apn: [this.data.model.apn, [CustomValidators.number]],
    });
  }

  close(): void {
    const model: Address = _.cloneDeep(this.data.model);
    Object.assign(model, this.form.value);

    // TODO: serialize into LS
    // TODO: redirect depends on anonimous or not
  }

}
