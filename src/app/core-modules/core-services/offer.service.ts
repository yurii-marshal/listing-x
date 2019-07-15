import { Injectable } from '@angular/core';
import { IDataService } from '../interfaces/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Offer } from '../models/offer';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../enums/auth-endpoints';

@Injectable()
export class OfferService implements IDataService <Offer> {

  constructor(private http: HttpClient) {
  }

  add(model: Offer, token?: string): Observable<Offer> {
    let params = new HttpParams();
    if (token) {
      params = params.set('token', token);
    }
    return this.http.post<Offer>(ApiEndpoint.Offer, model.serializeStepOne(), {params: params})
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
