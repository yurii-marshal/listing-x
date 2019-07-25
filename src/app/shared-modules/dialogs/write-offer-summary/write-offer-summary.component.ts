import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OfferService } from '../../../core-modules/core-services/offer.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Offer } from '../../../core-modules/models/offer';
import { DocumentLinkingService } from '../../../core-modules/core-services/document-linking.service';
import { Document } from '../../../core-modules/models/document';

@Component({
  selector: 'app-write-offer-summary',
  templateUrl: './write-offer-summary.component.html',
  styleUrls: ['./write-offer-summary.component.scss']
})
export class WriteOfferSummaryComponent implements OnInit {
  preApproval: Document[];
  proofOfFunds: Document[];
  coverLetter: Document[];

  get backLink(): string {
    return `/portal/offer/${this.data.model.id}/upload/`;
  }

  get stepOneLink(): string {
    return `/portal/offer/${this.data.model.id}/`;
  }

  get stepTwoLink(): string {
    return `/portal/offer/${this.data.model.id}/step-2`;
  }

  constructor(private formBuilder: FormBuilder,
              private service: OfferService,
              private linkingService: DocumentLinkingService,
              private snackbar: MatSnackBar,
              private router: Router,
              public dialogRef: MatDialogRef<WriteOfferSummaryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { model: Offer }) {
  }

  ngOnInit() {
    const offerId = this.data.model.id;
    this.linkingService.loadOfferDocumentsDeep(offerId)
      .subscribe(([preApproval, proofOfFunds, coverLetter]) => {
        this.preApproval = preApproval;
        this.proofOfFunds = proofOfFunds;
        this.coverLetter = coverLetter;
      });


  }

  hide() {
    this.dialogRef.close();
  }

  close() {
    // const model: LinkedDocuments = this.form.value;
    // model.offerId = this.data.model.offerId;
    // this.service.linkDocumentsToOffer(model)
    //   .subscribe(() => {
    //     this.dialogRef.close(model);
    //     this.router.navigate([this.nextLink]);
    //   });
  }

}
