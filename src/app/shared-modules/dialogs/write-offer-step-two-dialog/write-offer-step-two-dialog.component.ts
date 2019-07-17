import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { OfferService } from '../../../core-modules/core-services/offer.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Loan, Offer, Person } from '../../../core-modules/models/offer';
import * as _ from 'lodash';
import { LoanType } from '../../../core-modules/enums/loan-type';


@Component({
  selector: 'app-write-offer-step-two-dialog',
  templateUrl: './write-offer-step-two-dialog.component.html',
  styleUrls: ['./write-offer-step-two-dialog.component.scss']
})
export class WriteOfferStepTwoDialogComponent implements OnInit {
  form: FormGroup;

  get loans(): FormArray {
    return this.form.get('loans') as FormArray;
  }

  constructor(private formBuilder: FormBuilder,
              private service: OfferService,
              private snackbar: MatSnackBar,
              public dialogRef: MatDialogRef<WriteOfferStepTwoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { model: Offer, isEdit: boolean, verbose: boolean }) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      loans: this.formBuilder.array([ this.createLoan() ]),
      loanType: [LoanType.CONVENTIONAL],
      downPayment: [null],
      anySpecialFinancialTerms: [null],
    });
  }

  addLoan(): void {
    this.loans.push(this.createLoan());
  }

  remove(i: number): void {
    this.loans.removeAt(i);
  }

  createLoan(model?: Loan): FormGroup {
    const formGroup = this.formBuilder.group({
      initialDeposit: [],
      loanAmount: [],
      interestRate: [],
      points: []
    });

    if (model) {
      formGroup.patchValue(model);
    }

    return formGroup;
  }

  close(): void {
    const model: Offer = _.cloneDeep(this.data.model); // keep all fields from step 1
    Object.assign(model, this.form.value);
    //FIXME: loan: model.buyers = _.map(this.buyers.value, item => Object.assign(new Person(), item));

  }

}
