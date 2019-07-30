import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OfferService } from '../../../feature-modules/portal/services/offer.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { OfferSummary } from '../../../core-modules/models/offer';
import { DocumentLinkingService } from '../../../feature-modules/portal/services/document-linking.service';

@Component({
  selector: 'app-write-offer-summary',
  templateUrl: './write-offer-summary.component.html',
  styleUrls: ['./write-offer-summary.component.scss']
})
export class WriteOfferSummaryComponent {

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
              @Inject(MAT_DIALOG_DATA) public data: { model: OfferSummary }) {
  }

  hide() {
    this.dialogRef.close();
  }

  close() {
    this.router.navigate(['/portal']);
    this.snackbar.open('Successfully created offer', 'OK');
    this.hide();
  }
}
