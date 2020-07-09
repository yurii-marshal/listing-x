import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Offer } from '../../../../core-modules/models/offer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit, OnDestroy {
  offer: Offer;
  offerId: number;
  anonymousOffer: Offer;
  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private offerService: OfferService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.offerService.offerProgress = 1;
  }

  ngOnInit() {
    this.offerId = +this.route.snapshot.params.id;

    this.offerId ?
      this.offerService.getOfferById(this.offerId).pipe(takeUntil(this.onDestroyed$))
        .subscribe((offer: Offer) => this.offer = offer)
      : this.anonymousOffer = this.route.snapshot.data.anonymousOffer as Offer;
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  findOffers() {
    this.offer = null;
  }

  proceedToNextStep(offer) {
    this.router.navigateByUrl(`/portal/purchase-agreement/${offer.id}/step-two`);
  }

}
