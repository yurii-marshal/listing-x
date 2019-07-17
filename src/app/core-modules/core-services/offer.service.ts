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

  add(model: Offer, token?: string): Observable<Offer> {
    let params = new HttpParams();
    if (token) {
      params = params.set('token', token);
    }
    return this.http.post<Offer>(ApiEndpoint.Offer, model, {params: params});
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

  saveAnonymousOffer(): Observable<Offer> {
    const raw: string = localStorage.getItem(LocalStorageKey.Offer);
    const o = JSON.parse(raw); // from generation link
    const model = o.offer as Offer;
    const token = o.token;
    return this.add(model, token)
      .pipe(
        tap(() => localStorage.removeItem(LocalStorageKey.Offer))
      );
  }
}
