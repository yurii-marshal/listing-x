import { Injectable } from '@angular/core';
import { IDataService } from '../interfaces/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Offer } from '../models/offer';
import { Observable, of } from 'rxjs';
import { ApiEndpoint } from '../enums/auth-endpoints';
import { map, tap } from 'rxjs/operators';
import { LocalStorageKey } from '../enums/local-storage-key';
import { detailUrl } from '../utils/util';

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
    return this.http.get<Offer>(url)
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

  update(model: Offer): Observable<Offer> {
    const url = detailUrl(ApiEndpoint.Offer, model.id);
    return this.http.put<Offer>(url, model);
  }

  get anonymousOfferData(): {offer: Offer, token: string} {
    const raw: string = localStorage.getItem(LocalStorageKey.Offer);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw); // from generation link
  }
}
