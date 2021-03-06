import { Component, Input, OnInit } from '@angular/core';
import { CounterOffer } from 'src/app/core-modules/models/counter-offer';
import { takeUntil } from 'rxjs/operators';
import { CounterOfferService } from 'src/app/feature-modules/portal/services/counter-offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { CounterOfferType } from '../../../core-modules/models/counter-offer-type';

@Component({
  selector: 'app-counter-offer-controls',
  templateUrl: './counter-offer-controls.component.html',
  styleUrls: ['./counter-offer-controls.component.scss']
})
export class CounterOfferControlsComponent implements OnInit {
  @Input() counterOffer: CounterOffer;
  @Input() visible: boolean = false;
  // optional
  @Input() isAgentSeller: boolean;
  @Input() disabled: boolean = false;

  offerId: number;
  onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public counterOfferService: CounterOfferService,
    private snackbar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.offerId = +this.route.snapshot.params.offerId;
  }

  rejectCO() {
    this.disabled = true;

    this.counterOfferService.rejectCounterOffer(this.counterOffer.id)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.disabled = false;

        this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/details`);
      });
  }

  createCCO(type?) {
    this.disabled = true;

    const typeRevers = this.counterOffer.offerType as string === 'buyer_counter_offer' ? 'counter_offer' : 'buyer_counter_offer';
    this.counterOfferService.createCounterOffer({offer: this.offerId, offerType: type ? type : typeRevers})
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: CounterOffer) => {
        this.disabled = false;
        this.snackbar.open('Counter Offer is created');
        this.router.navigateByUrl(`portal/offer/${this.offerId}/counter-offers/${data.id}/${CounterOfferType[data.offerType]}`);
      });
  }
}
