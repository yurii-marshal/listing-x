import { Injectable, Injector } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';
import { Offer, OfferSummary } from '../../../core-modules/models/offer';
import { ApiEndpoint } from '../../../core-modules/enums/api-endpoints';
import { BaseDataService } from '../../../core-modules/base-classes/base-data-service';

@Injectable()
export class OfferService extends BaseDataService<Offer> {

  protected crudEndpoint: ApiEndpoint = ApiEndpoint.Offer;

  constructor(protected injector: Injector) {
    super(injector);
  }

  add(model: Offer): Observable<Offer> {
    const offerData = this.anonymousOfferData;
    let params = new HttpParams();
    if (offerData) {
      params = params.set('token', offerData.token);
    }
    return this.http.post<Offer>(ApiEndpoint.Offer, model, {params: params})
      .pipe(
        tap(() => offerData && localStorage.removeItem(LocalStorageKey.Offer)) // tear down
      );
  }

  getAnonymousOffer(token: number): Observable<Offer> {
    return this.http.get<Offer>(`/offers/token/${token}`);
  }

  loadOfferSummary(id: number): Observable<OfferSummary> {
    return this.http.get<OfferSummary>(`/offers/${id}/summary`);
  }


  get anonymousOfferData(): { offer: Offer, token: string } {
    const raw: string = localStorage.getItem(LocalStorageKey.Offer);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw); // from generation link
  }
}
