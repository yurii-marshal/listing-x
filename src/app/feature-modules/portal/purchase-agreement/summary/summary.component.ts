import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../../../core-modules/models/offer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
  offer: Offer;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private offerService: OfferService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.offerService.offerProgress = 4;

    this.offerService.getOfferById(+this.route.snapshot.params.id)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((offer: Offer) => {
        this.offer = offer;
      });
  }

  ngOnDestroy() {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  saveOffer() {
  }

}
