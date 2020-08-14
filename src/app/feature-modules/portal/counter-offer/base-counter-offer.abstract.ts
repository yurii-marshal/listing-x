import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { OnDestroy, OnInit } from '@angular/core';
import { CounterOffer } from '../../../core-modules/models/counter-offer';
import { CounterOfferService } from '../services/counter-offer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export abstract class BaseCounterOfferAbstract<TModel> implements OnInit, OnDestroy {

  protected id: number;
  protected counterOffer: CounterOffer;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected offerService: OfferService,
    protected counterOfferService: CounterOfferService,
  ) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.params.id;

    if (this.id) {
      this.counterOfferService.loadOne(this.id)
        .pipe(takeUntil(this.onDestroyed$))
        .subscribe((data: CounterOffer) => {
          this.counterOffer = data;
        });
    }
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  closeCO() {
    this.router.navigateByUrl(`portal/purchase-agreements/` +
      (this.offerService.currentOffer ? `${this.offerService.currentOffer.id}/details` : 'all')
    );
  }

}
