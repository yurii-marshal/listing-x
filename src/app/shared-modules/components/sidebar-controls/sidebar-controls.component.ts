import { Component, Input, OnInit } from '@angular/core';
import { CounterOffer } from 'src/app/core-modules/models/counter-offer';
import { takeUntil } from 'rxjs/operators';
import { CounterOfferService } from 'src/app/feature-modules/portal/services/counter-offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-sidebar-controls',
  templateUrl: './sidebar-controls.component.html',
  styleUrls: ['./sidebar-controls.component.scss']
})
export class SidebarControlsComponent implements OnInit {
  @Input() counterOffer: CounterOffer;
  @Input() visible: boolean = false;

  offerId: number;
  onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public counterOfferService: CounterOfferService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.offerId = +this.route.snapshot.params.offerId;
  }

  rejectCO() {
    this.counterOfferService.rejectCounterOffer(this.counterOffer.id)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/details`);
      });
  }

  createCCO() {
    const type = this.counterOffer.offerType as string === 'buyer_counter_offer' ? 'counter_offer' : 'buyer_counter_offer';
    this.counterOfferService.createCounterOffer({offer: this.offerId, offerType: type})
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: CounterOffer) => {
        this.snackbar.open('Counter Offer is created');
        // this.router.navigateByUrl(`portal/offer/${this.offerId}/counter-offers/${data.id}/${CounterOfferType[type]}`);
        this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/details`);
      });
  }
}
