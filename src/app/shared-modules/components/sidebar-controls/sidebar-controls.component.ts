import { Component, Input, OnInit } from '@angular/core';
import { CounterOffer } from 'src/app/core-modules/models/counter-offer';
import { User } from 'src/app/feature-modules/auth/models';
import { takeUntil } from 'rxjs/operators';
import { CounterOfferService } from 'src/app/feature-modules/portal/services/counter-offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CounterOfferType } from 'src/app/core-modules/models/counter-offer-type';

@Component({
  selector: 'app-sidebar-controls',
  templateUrl: './sidebar-controls.component.html',
  styleUrls: ['./sidebar-controls.component.scss']
})
export class SidebarControlsComponent implements OnInit {
  @Input() counterOffer: CounterOffer;
  @Input() user: User;
  @Input() isSideBarOpen: boolean;

  offerId: number;

  onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public counterOfferService: CounterOfferService,
  ) { }

  ngOnInit() {
    this.offerId = +this.route.snapshot.params.offerId;
  }

  rejectCO() {
    this.counterOfferService.rejectCounterOffer(this.offerId)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/details`);
      });
  }

  createCO(type: CounterOfferType) {
    this.counterOfferService.createCounterOffer({offer: this.offerId, type})
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: CounterOffer) => {
        this.router.navigateByUrl(`portal/offer/${this.offerId}/counter-offers/${data.id}/multiple`);
      });
  }
}
