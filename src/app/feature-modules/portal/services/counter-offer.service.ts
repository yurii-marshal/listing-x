import { Injectable, Injector } from '@angular/core';
import { BaseDataService } from '../../../core-modules/base-classes/base-data-service';
import { CounterOffer } from '../../../core-modules/models/counter-offer';
import { ApiEndpoint } from '../../../core-modules/enums/api-endpoints';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CounterOfferService extends BaseDataService<CounterOffer> {

  constructor(protected injector: Injector) {
    super(injector, ApiEndpoint.CounterOffer);
  }

  createCounterOffer(model: object): Observable<any> {
    return this.http.post(`/counter_offers/`, model);
  }

  getCounterOfferDocument(id: number, type: 'seller' | 'buyer' | 'multiple'): Observable<any> {
    return this.http.get(`/counter_offers/agreement-doc/${id}/${type}`);
  }

  updateCounterOfferDocumentField(query, model: object) {
    let params = new HttpParams();
    params = params.set('page', query.page);
    return this.http.patch(`/counter_offers/${query.offerId}/agreement-doc`, model, {params});
  }

  getCounterOffersList(offerId: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('offer_id', offerId.toString());
    return this.http.get(`/counter_offers/`, {params});
  }

  signCounterOffer(offerId: number): Observable<any> {
    return this.http.post(`/counter_offers/${offerId}/sign/`, {})
      .pipe(switchMap(() => super.loadOne(offerId)));
  }

  rejectCounterOffer(offerId: number): Observable<any> {
    return this.http.post(`/counter_offers/${offerId}/reject/`, {});
  }
}
