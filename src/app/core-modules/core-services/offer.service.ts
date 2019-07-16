import { Injectable } from '@angular/core';
import { IDataService } from '../interfaces/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Offer } from '../models/offer';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../enums/auth-endpoints';
import { map } from 'rxjs/operators';

@Injectable()
export class OfferService implements IDataService <Offer> {

  constructor(private http: HttpClient) {
  }


  add(model: Offer, token?: string): Observable<Offer> {
    let params = new HttpParams();
    if (token) {
      params = params.set('token', token);
    }
    return this.http.post<Offer>(ApiEndpoint.Offer, model.serialize(), {params: params});
  }

  getAnonymousOffer(token): Observable<Offer> {
    const url = ApiEndpoint.AnonymousOffer + token + '/';
    return this.http.get<Offer>(url)
      .pipe(map(raw => new Offer(raw)));
  }

  delete(id: number): Observable<void> {
    return undefined;
  }

  loadList(params?: HttpParams): Observable<Offer[]> {
    return undefined;
  }

  loadOne(id: number): Observable<Offer> {
    return undefined;
  }

  update(model: Offer): Observable<Offer> {
    return undefined;
  }

  wrap(item: any): Offer {
    return undefined;
  }
}
