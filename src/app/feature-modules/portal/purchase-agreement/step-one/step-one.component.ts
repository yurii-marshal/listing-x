import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Offer } from '../../../../core-modules/models/offer';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit, OnDestroy {
  offer: Offer;
  offerId: number;
  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private offerService: OfferService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.offerId = +this.route.snapshot.params.id;
    this.offer = this.route.snapshot.data.offer;
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
