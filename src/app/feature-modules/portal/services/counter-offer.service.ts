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

  updateCounterOfferDocumentField(id: number, type: 'seller' | 'buyer' | 'multiple', model) {
    return this.http.patch(`/counter_offers/agreement-doc/${id}/${type}`, model);
  }

  getCounterOffersList(offerId: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('offer_id', offerId.toString());
    return this.http.get(`/counter_offers/`, {params});
  }

  signCounterOffer(coId: number, type: 'sign' | 'final_approval'): Observable<any> {
    return this.http.post(`/counter_offers/${coId}/${type}/`, {})
      .pipe(switchMap(() => super.loadOne(coId)));
  }

  rejectCounterOffer(coId: number): Observable<any> {
    return this.http.post(`/counter_offers/${coId}/reject/`, {});
  }
}
