import { Injectable, Injector } from '@angular/core';
import { BaseDataService } from '../../../core-modules/base-classes/base-data-service';
import { CounterOffer } from '../../../core-modules/models/counter-offer';
import { ApiEndpoint } from '../../../core-modules/enums/api-endpoints';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CounterOfferService extends BaseDataService<CounterOffer> {

  constructor(protected injector: Injector) {
    super(injector, ApiEndpoint.CounterOffer);
  }

  signCounterOffer(offerId: number): Observable<any> {
    return this.http.post(`/offers/${offerId}/sign/`, {})
      .pipe(switchMap(() => super.loadOne(offerId)));
  }

  rejectCounterOffer(offerId: number): Observable<any> {
    return this.http.post(`/offers/${offerId}/reject/`, {});
  }
}
