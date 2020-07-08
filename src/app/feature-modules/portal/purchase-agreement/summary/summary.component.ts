import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { OfferSummary } from '../../../../core-modules/models/offer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
  offerSummary: OfferSummary;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private offerService: OfferService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.offerService.offerProgress = 4;

    this.offerService.loadOfferSummary(+this.route.snapshot.params.id)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: OfferSummary) => {
        this.offerSummary = data;
      });
  }

  ngOnDestroy() {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  saveOffer() {
    this.offerService.update(this.offerSummary)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.snackbar.open('Offer is updated');
      });
  }

}
