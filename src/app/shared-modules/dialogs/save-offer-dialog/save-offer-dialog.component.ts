import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-save-offer-dialog',
  templateUrl: './save-offer-dialog.component.html',
  styleUrls: ['./save-offer-dialog.component.scss']
})
export class SaveOfferDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SaveOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  close(resp) {
    this.dialogRef.close(resp);
  }

}
