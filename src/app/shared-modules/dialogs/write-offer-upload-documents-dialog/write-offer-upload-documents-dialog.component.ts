import { Component, Inject, OnInit } from '@angular/core';
import { UploadDocumentType } from '../../../core-modules/enums/upload-document-type';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { LinkedDocuments } from '../../../core-modules/models/linked-documents';
import { DocumentLinkingService } from '../../../core-modules/core-services/document-linking.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-write-offer-upload-documents-dialog',
  templateUrl: './write-offer-upload-documents-dialog.component.html',
  styleUrls: ['./write-offer-upload-documents-dialog.component.scss']
})
export class WriteOfferUploadDocumentsDialogComponent implements OnInit {
  form: FormGroup;

  Type = UploadDocumentType;

  constructor(public route: ActivatedRoute,
              private service: DocumentLinkingService,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<WriteOfferUploadDocumentsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { model: LinkedDocuments, isEdit: boolean }) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      preApproval: [[]],
      proofOfFunds: [[]],
      coverLetter: [[]],
    });

    if (this.data.model) {
      const model = _.pick(this.data.model, Object.keys(this.form.controls));
      this.form.setValue(model);
    }
  }

  goToNext() {
    // TODO: summary page
  }

  close() {
    const model: LinkedDocuments = this.form.value;
    model.offerId = this.data.model.offerId;
    this.service.linkDocumentsToOffer(model)
      .subscribe(() => {
        this.dialogRef.close(model);
        this.router.navigate(['/portal/summary/'], {queryParams: {offerId: model.offerId}});
      });
  }
}
