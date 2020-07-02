import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Offer } from '../../../core-modules/models/offer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OfferService } from '../../../feature-modules/portal/services/offer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit-offer-dialog',
  templateUrl: './edit-offer-dialog.component.html',
  styleUrls: ['./edit-offer-dialog.component.scss']
})
export class EditOfferDialogComponent implements OnInit, OnDestroy {
  offer: Offer;
  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private offerService: OfferService,
    public dialogRef: MatDialogRef<EditOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { offer: Offer },
  ) {
  }

  ngOnInit() {
    this.offer = this.data.offer;
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  close(save: boolean) {
    if (save) {
      this.offerService.update(this.offer)
        .pipe(takeUntil(this.onDestroyed$))
        .subscribe(() => this.dialogRef.close(this.offer));
    } else {
      this.dialogRef.close();
    }
  }

}
