import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { Offer, Person } from '../../../core-modules/models/offer';
import { OfferService } from '../../../feature-modules/portal/services/offer.service';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

enum Type {
  Buyers = 'buyers',
  Sellers = 'sellers'
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

  constructor(private formBuilder: FormBuilder,
              private service: OfferService,
              private snackbar: MatSnackBar,
              private router: Router,
              public dialogRef: MatDialogRef<WriteOfferDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { model: Offer, isAnonymous: boolean, isEdit: boolean, verbose: boolean }) {
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    const disabled: boolean = Boolean(this.data.isAnonymous); // TODO: or statement LIS-65

    this.form = this.formBuilder.group({
      id: [null, []],
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

  applyFormValues(model?: Offer) {
    this.form.patchValue({
      id: model.id,
      streetName: model.streetName,
      city: model.city,
      state: model.state,
      zip: model.zip,
      apn: model.apn,
      price: model.price,
      closeEscrowDays: model.closeEscrowDays,
    });

    // Nested forms

    if (!_.isEmpty(model.buyers)) {
      const buyers = _.map(model.buyers, item => this.createEntity(item));
      this.form.setControl('buyers', this.formBuilder.array(buyers));
    }

    if (!_.isEmpty(model.sellers)) {
      const sellers = _.map(model.sellers, item => this.createEntity(item, this.data.isAnonymous));
      this.form.setControl('sellers', this.formBuilder.array(sellers));
    }
  }

  createEntity(model?: Person, disabled: boolean = false): FormGroup {
    const formGroup = this.formBuilder.group({
      id: [null, []],
      firstName: [{value: null, disabled}, [Validators.required, Validators.maxLength(30)]],
      lastName: [{value: null, disabled}, [Validators.required, Validators.maxLength(150)]],
      email: [{value: null, disabled}, [Validators.required, Validators.email]], // CustomValidators.unique(this.)
    });
    if (model) {
      formGroup.patchValue(model);
    }
    return formGroup;
  }

  add(type: Type = Type.Buyers) {
    const control = this.form.get(type) as FormArray;
    control.push(this.createEntity());
  }

  remove(type: Type, index: number) {
    const control = this.form.get(type) as FormArray;
    control.removeAt(index);
  }

  close(): void {
    const model: Offer = this.form.getRawValue(); // to include 'state'
    if (this.data.isAnonymous) {
      this.dialogRef.close(model);
      return; // Exit
    }

    //TODO: only do http request in case: form.dirty
    const message = `Successfully ${this.data.isEdit ? 'updated' : 'created new'} offer.`;
    of(model)
      .pipe(
        switchMap((item: Offer) => this.data.isEdit
          ? this.service.update(item)
          : this.service.add(item)
        ),
        tap(() => this.data.verbose && this.snackbar.open(message))
      )
      .subscribe(({id}) => {
        this.dialogRef.close(model);
        this.router.navigate(['/portal/offer', id, 'step-2']);
      });
  }
}
