import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../../../core-modules/models/offer';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditOfferDialogComponent } from '../../../../shared-modules/dialogs/edit-offer-dialog/edit-offer-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit, OnDestroy {
  isSideBarOpen: boolean;
  offerId: number;
  offer: Offer;
  progressState$: Subject<number> = new Subject();
  private onDestroyed$: Subject<void> = new Subject<void>();

  arr = Array(200);

  constructor(
    private offerService: OfferService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.offerService.offerProgress = 2;
    this.offerId = +this.route.snapshot.params.id;

    this.offerService.getOfferById(this.offerId)
      .pipe(
        takeUntil(this.onDestroyed$)
      )
      .subscribe((offer: Offer) => {
        this.offer = offer;
      });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  editOffer() {
    const dialogRef = this.dialog.open(EditOfferDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {offer: this.offer}
    });

    dialogRef.afterClosed()
      .subscribe(() => {
        this.snackbar.open('Offer is updated');
      });
  }

  acceptOfferPDF() {
    this.router.navigate([`portal/purchase-agreement/${this.offer.id}/step-three`]);
  }

}
