import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer, OfferSummary } from '../../../../core-modules/models/offer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
  offer: Offer;
  offerSummary: OfferSummary;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private offerService: OfferService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.offer = this.route.snapshot.data.offer;

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
    this.offer.isSigned
      ? this.router.navigateByUrl(`/portal/purchase-agreements/${this.offer.id}/details`)
      : this.router.navigateByUrl(`/portal/purchase-agreements/${this.offer.id}/sign`);

    // this.offerService.update(this.offerSummary)
    //   .pipe(takeUntil(this.onDestroyed$))
    //   .subscribe(() => {
    //     this.snackbar.open('Offer is updated');
    //   });
  }

  closeOffer() {
    this.router.navigateByUrl('/portal/purchase-agreements/all');
  }

}
