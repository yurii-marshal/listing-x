import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Offer } from '../../../core-modules/models/offer';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';
import { Router } from '@angular/router';

@Component({
  selector: 'app-write-offer-dialog',
  templateUrl: './write-offer-dialog.component.html',
  styleUrls: ['./write-offer-dialog.component.scss']
})
export class WriteOfferDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<WriteOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Offer,
  ) {
  }

  onClose(offer?: Offer) {
    offer
      ? localStorage.setItem(LocalStorageKey.Offer, JSON.stringify(offer))
      : localStorage.removeItem(LocalStorageKey.Offer);

    this.dialogRef.close(offer);
  }
}
