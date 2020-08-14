import { Router } from '@angular/router';
import { OfferService } from '../services/offer.service';

export abstract class BaseCounterOfferAbstract<TModel> {

  constructor(
    protected router: Router,
    protected offerService: OfferService,
  ) {
  }

  closeCO() {
    this.router.navigateByUrl(`portal/purchase-agreements/` +
      (this.offerService.currentOffer ? `${this.offerService.currentOffer.id}/details` : 'all')
    );
  }

}
