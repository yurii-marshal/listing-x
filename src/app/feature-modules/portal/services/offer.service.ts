import { Injectable, Injector } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';
import { Offer, OfferSummary } from '../../../core-modules/models/offer';
import { ApiEndpoint } from '../../../core-modules/enums/api-endpoints';
import { BaseDataService } from '../../../core-modules/base-classes/base-data-service';

@Injectable()
export class OfferService extends BaseDataService<Offer> {
  public offerProgress: number;
  public offerChanged: Subject<void> = new Subject<void>();

  public currentOffer: Offer;
  public changedOfferModel: Offer;

  constructor(protected injector: Injector) {
    super(injector, ApiEndpoint.Offer);
  }

  get anonymousOfferData(): { offer: Offer, token: string } {
    const raw: string = localStorage.getItem(LocalStorageKey.Offer);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw); // from generation link
  }

  getOfferById(id: number) {
    if (this.currentOffer && (this.currentOffer.id === id)) {
      return of(this.currentOffer);
    }

    return this.http.get<Offer>(`/offers/${id}`)
      .pipe(
        tap((offer: Offer) => this.currentOffer = offer),
      );
  }

  add(model: Offer): Observable<Offer> {
    const offerData = this.anonymousOfferData;
    let params = new HttpParams();
    if (offerData) {
      params = params.set('token', offerData.token);
    }
    return this.http.post<Offer>(this.crudEndpoint, model, {params: params})
      .pipe(
        tap(() => this.offerChanged.next()),
        tap(() => offerData && localStorage.removeItem(LocalStorageKey.Offer)) // tear down
      );
  }

  update(model: Offer): Observable<Offer> {
    this.currentOffer = model;
    this.changedOfferModel = null;

    return super.update(model)
      .pipe(tap(() => this.offerChanged.next()));
  }

  getAnonymousOffer(token: number): Observable<Offer> {
    return this.http.get<Offer>(`/offers/token/${token}`);
  }

  loadOfferSummary(id: number): Observable<OfferSummary> {
    return this.http.get<OfferSummary>(`/offers/${id}/summary`);
  }
}
