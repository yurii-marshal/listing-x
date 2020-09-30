import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-finish-signing-dialog',
  templateUrl: './finish-signing-dialog.component.html',
  styleUrls: ['./finish-signing-dialog.component.scss']
})
export class FinishSigningDialogComponent {

  constructor(public dialogRef: MatDialogRef<FinishSigningDialogComponent>) { }

  sign() {
    this.dialogRef.close(true);
  }
}
