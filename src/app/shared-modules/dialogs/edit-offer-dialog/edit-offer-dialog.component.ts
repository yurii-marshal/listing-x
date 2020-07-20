import { Component, Inject, OnDestroy } from '@angular/core';
import { Offer } from '../../../core-modules/models/offer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OfferService } from '../../../feature-modules/portal/services/offer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-edit-offer-dialog',
  templateUrl: './edit-offer-dialog.component.html',
  styleUrls: ['./edit-offer-dialog.component.scss']
})
export class EditOfferDialogComponent implements OnDestroy {
  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private offerService: OfferService,
    public dialogRef: MatDialogRef<EditOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { offer: Offer },
  ) {
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  close(data?: Offer) {
    if (data) {
      this.offerService.update(data)
        .pipe(takeUntil(this.onDestroyed$))
        .subscribe(() => this.dialogRef.close({saved: true}));
    } else {
      const isChanged = !_.isEqual(this.offerService.currentOffer, this.offerService.changedOfferModel);
      this.dialogRef.close({requestToSave: isChanged, changedOfferModel: this.offerService.changedOfferModel});
    }
  }

}
