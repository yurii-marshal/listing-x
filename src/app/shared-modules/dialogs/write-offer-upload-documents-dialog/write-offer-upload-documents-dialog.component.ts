import { Component, OnInit } from '@angular/core';
import { UploadDocumentType } from '../../../core-modules/enums/upload-document-type';

@Component({
  selector: 'app-write-offer-upload-documents-dialog',
  templateUrl: './write-offer-upload-documents-dialog.component.html',
  styleUrls: ['./write-offer-upload-documents-dialog.component.scss']
})
export class WriteOfferUploadDocumentsDialogComponent implements OnInit {
  Type = UploadDocumentType;

  constructor() { }

  ngOnInit() {

  }

  goToNext() {
    // TODO: summary page
  }

}
