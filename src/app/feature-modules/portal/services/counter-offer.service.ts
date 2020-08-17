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

  getCounterOfferDocument(id: number): Observable<any> {
    return this.http.get(`/counter-offers/${id}/agreement-doc`);
  }

  updateCounterOfferDocumentField(query, model: object) {
    let params = new HttpParams();
    params = params.set('page', query.page);
    return this.http.patch(`/counter-offers/${query.offerId}/agreement-doc`, model, {params});
  }

  signCounterOffer(offerId: number): Observable<any> {
    return this.http.post(`/counter-offers/${offerId}/sign/`, {})
      .pipe(switchMap(() => super.loadOne(offerId)));
  }

  rejectCounterOffer(offerId: number): Observable<any> {
    return this.http.post(`/counter-offers/${offerId}/reject/`, {});
  }
}
