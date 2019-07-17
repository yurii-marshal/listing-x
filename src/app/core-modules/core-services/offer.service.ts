import { Injectable } from '@angular/core';
import { IDataService } from '../interfaces/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Offer } from '../models/offer';
import { Observable, of } from 'rxjs';
import { ApiEndpoint } from '../enums/auth-endpoints';
import { map, tap } from 'rxjs/operators';
import { LocalStorageKey } from '../enums/local-storage-key';

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
    const url = ApiEndpoint.AnonymousOffer + token + '/';
    return this.http.get<Offer>(url)
  }

  delete(id: number): Observable<void> {
    return undefined;
  }

  loadList(params?: HttpParams): Observable<Offer[]> {
    return undefined;
  }

  loadOne(id: number): Observable<Offer> {
    return this.http.get<Offer>(ApiEndpoint.Offer + id + '/');
  }

  update(model: Offer): Observable<Offer> {
    return undefined;
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
