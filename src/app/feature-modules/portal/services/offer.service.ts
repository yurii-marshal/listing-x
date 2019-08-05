import { Injectable } from '@angular/core';
import { IDataService } from '../../../core-modules/interfaces/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';
import { detailUrl } from '../../../core-modules/utils/util';
import { Offer, OfferSummary } from '../../../core-modules/models/offer';
import { ApiEndpoint } from '../../../core-modules/enums/api-endpoints';

@Injectable()
export class OfferService implements IDataService <Offer> {

  constructor(private http: HttpClient) {
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

  getAnonymousOffer(token): Observable<Offer> {
    const url = detailUrl(ApiEndpoint.AnonymousOffer, token);
    return this.http.get<Offer>(url);
  }

  delete(id: number): Observable<void> {
    return undefined;
  }

  loadList(params?: HttpParams): Observable<Offer[]> {
    return undefined;
  }

  loadOne(id: number): Observable<Offer> {
    const url = detailUrl(ApiEndpoint.Offer, id);
    return this.http.get<Offer>(url);
  }

  loadOfferSummary(id: number): Observable<OfferSummary> {
    return this.http.get<OfferSummary>(`/offers/${id}/summary`);
  }

  update(model: Offer): Observable<Offer> {
    const url = detailUrl(ApiEndpoint.Offer, model.id);
    return this.http.put<Offer>(url, model);
  }

  get anonymousOfferData(): { offer: Offer, token: string } {
    const raw: string = localStorage.getItem(LocalStorageKey.Offer);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw); // from generation link
  }
}
