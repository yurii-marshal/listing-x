import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferService } from '../../../feature-modules/portal/services/offer.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Loan, Offer } from '../../../core-modules/models/offer';
import * as _ from 'lodash';
import { LoanType } from '../../../core-modules/enums/loan-type';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';


@Component({
  selector: 'app-write-offer-step-two-dialog',
  templateUrl: './write-offer-step-two-dialog.component.html',
  styleUrls: ['./write-offer-step-two-dialog.component.scss']
})
export class WriteOfferStepTwoDialogComponent implements OnInit {
  form: FormGroup;

  loanTypes: {value, label} [] = Object.keys(LoanType).map(key => ({ value: LoanType[key], label: LoanType[key] }));

  get loans(): FormArray {
    return this.form.get('loans') as FormArray;
  }

  get backLink() {
    return `/portal/offer/${this.data.model.id}/`;
  }

  constructor(private formBuilder: FormBuilder,
              private service: OfferService,
              private snackbar: MatSnackBar,
              private router: Router,
              public route: ActivatedRoute,
              public dialogRef: MatDialogRef<WriteOfferStepTwoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { model: Offer, isEdit: boolean, verbose: boolean }) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      initialDeposit: [null, [CustomValidators.number]],
      loans: this.formBuilder.array([ this.createLoan() ]),
      loanType: [LoanType.CONVENTIONAL],
      downPayment: [{value: null, disabled: true}],
      anySpecialFinancialTerms: [],
    });

    if (this.data.model) {
      this.applyFormValues();
    }

    this.loans.valueChanges
      .subscribe(() => this.recalculateDownPayment())
  }

  applyFormValues() {
    const model: Offer = this.data.model;
    const formControlNames: string[] = _.without(Object.keys(this.form.controls), 'loans');
    const formData = _.pick(model, formControlNames);
    this.form.patchValue(formData);

    // Nested form
    if (!_.isEmpty(model.loans)) {
      const buyers = _.map(model.loans, item => this.createLoan(item));
      this.form.setControl('loans', this.formBuilder.array(buyers));
    }
  }

  addLoan(): void {
    this.loans.push(this.createLoan());
  }

  remove(i: number): void {
    this.loans.removeAt(i);
    this.form.markAsDirty();
  }

  createLoan(model?: Loan): FormGroup {
    const formGroup = this.formBuilder.group({
      initialDeposit: [null, [CustomValidators.number]],
      loanAmount: [null, [CustomValidators.number]],
      interestRate: [null, [CustomValidators.number, Validators.max(100)]],
      points: [null, [CustomValidators.number, Validators.max(100)]]
    });

    if (model) {
      formGroup.patchValue(model);
    }
    return formGroup;
  }

  close(): void {
    const model: Offer = _.cloneDeep(this.data.model);
    if (!this.form.dirty) {
      return this.closeAndRedirect(model); // Exit
    }

    // keep all fields from step 1 and extend with step 2 fields
    Object.assign(model, this.form.getRawValue());
    this.service.update(model)
      .subscribe(() => this.closeAndRedirect(model))
  }


  private closeAndRedirect(model: Offer) {
    this.dialogRef.close(model);
    this.router.navigate(['/portal/offer', model.id, 'upload']);
  }

  private recalculateDownPayment() {
    const price = Number(this.data.model.price);
    const amount: number = _.chain(this.loans.controls)
      .map(control => control.get('loanAmount').value)
      .filter(amount => _.identity(amount) && !isNaN(amount))
      .reduce((subtract: number, value: number) => subtract - Number(value), price)
      .ceil(2)
      .value();

    this.form.get('downPayment').setValue(amount);
  }
}
