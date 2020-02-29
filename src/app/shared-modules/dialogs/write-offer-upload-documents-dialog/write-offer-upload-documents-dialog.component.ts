import {Component, Inject, OnInit} from '@angular/core';
import {UploadDocumentType} from '../../../core-modules/enums/upload-document-type';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LinkedDocuments} from '../../../core-modules/models/linked-documents';
import {DocumentLinkingService} from '../../../feature-modules/portal/services/document-linking.service';
import * as _ from 'lodash';
import {UploadDocsModalType} from '../../../core-modules/enums/upload-docs-modal-type';

@Component({
  selector: 'app-write-offer-upload-documents-dialog',
  templateUrl: './write-offer-upload-documents-dialog.component.html',
  styleUrls: ['./write-offer-upload-documents-dialog.component.scss']
})
export class WriteOfferUploadDocumentsDialogComponent implements OnInit {
  form: FormGroup;

  Type = UploadDocumentType;

  get ModalTypes() {
    return UploadDocsModalType;
  }

  get closeLink() {
    return this.data.modalType === UploadDocsModalType.OfferUpdating ?
      `/portal/transaction/${this.data.model.offerId}` : '../';
  }

  constructor(public route: ActivatedRoute,
              private service: DocumentLinkingService,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<WriteOfferUploadDocumentsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {model: LinkedDocuments, modalType: UploadDocsModalType}) { }

  ngOnInit() {
    const disabled = this.data.modalType === UploadDocsModalType.Upload;
    this.form = this.formBuilder.group({
      preApproval: [{value: [], disabled}],
      proofOfFunds: [{value: [], disabled}],
      coverLetter: [{value: [], disabled}],
    });

    if (this.data.model) {
      const model = _.pick(this.data.model, Object.keys(this.form.controls));
      this.form.setValue(model);
    }
  }

  continue(): void {
    const model: LinkedDocuments = this.form.value;
    model.offerId = this.data.model.offerId;
    // TODO: only do http request in case: form.dirty
    this.service.linkDocumentsToOffer(model)
      .subscribe(() => {
        this.dialogRef.close(model);
        this.router.navigate(['/portal/offer', this.data.model.offerId, 'summary']);
      });
  }
}
