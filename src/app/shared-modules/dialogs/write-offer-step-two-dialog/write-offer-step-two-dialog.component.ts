import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { OfferService } from '../../../core-modules/core-services/offer.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Offer, Person } from '../../../core-modules/models/offer';
import * as _ from 'lodash';


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

  constructor( private formBuilder: FormBuilder,
               private service: OfferService,
               private snackbar: MatSnackBar,
               public dialogRef: MatDialogRef<WriteOfferStepTwoDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: {model: Offer, isEdit: boolean, verbose: boolean}) {

  }

  ngOnInit() {
    //FIXME: const loans = _.map(this.data.model.loans, item => );

    this.form = this.formBuilder.group({
      loans: this.formBuilder.array([]),
    });
  }

  add(): void {

  }

  remove(i: number): void {

  }

  close(): void {
    const model: Offer = _.cloneDeep(this.data.model); // keep all fields from step 1
    Object.assign(model, this.form.value);
    //FIXME: loan: model.buyers = _.map(this.buyers.value, item => Object.assign(new Person(), item));

  }

}
