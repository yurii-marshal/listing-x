import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Offer } from '../../../../core-modules/models/offer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageKey } from '../../../../core-modules/enums/local-storage-key';

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
  }

  ngOnInit() {
    this.offerId = +this.route.snapshot.params.id;
    const offer = this.route.snapshot.data.offer;

    if (this.offerId) {
      this.offer = offer;
    } else {
      this.offerService.currentOffer = null;
      this.anonymousOffer = offer;
    }
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  // findOffers() {
  //   this.offer = null;
  // }

  nextStep(offer) {
    this.router.navigateByUrl(`/portal/purchase-agreement/${offer.id}/step-two`);
  }

}
