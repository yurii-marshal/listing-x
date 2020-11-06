import { Injectable, Injector } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';
import { Offer, OfferSummary } from '../../../core-modules/models/offer';
import { ApiEndpoint } from '../../../core-modules/enums/api-endpoints';
import { BaseDataService } from '../../../core-modules/base-classes/base-data-service';
import { CalendarEvent } from '../../../core-modules/models/calendar-event';
import { AgreementStatus } from '../../../core-modules/models/agreement';

@Injectable()
export class OfferService extends BaseDataService<Offer> {
  public offerChanged$: Subject<Offer> = new Subject<Offer>();

  public currentOffer: Offer;
  public changedOfferModel: Offer;

  public isSideBarOpen: boolean = false;

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
    return this.http.post<Offer>(this.crudEndpoint, model)
      .pipe(
        tap((offer: Offer) => this.offerChanged$.next(offer)),
        tap(() => this.anonymousOfferData && localStorage.removeItem(LocalStorageKey.Offer)) // tear down
      );
  }

  update(model: Offer): Observable<Offer> {
    this.currentOffer = model;
    this.changedOfferModel = null;

    return super.update(model)
      .pipe(tap((data: Offer) => this.offerChanged$.next(data)));
  }

  getAnonymousOffer(token: number): Observable<Offer> {
    return this.http.get<Offer>(`/offers/token/${token}`);
  }

  getOfferDocument(id: number): Observable<any> {
    return this.http.get(`/offers/${id}/agreement-doc`);
  }

  updateOfferDocumentField(query, model: object) {
    let params = new HttpParams();
    params = params.set('page', query.page);
    return this.http.patch(`/offers/${query.offerId}/agreement-doc`, model, {params});
  }

  loadOfferSummary(id: number): Observable<OfferSummary> {
    return this.http.get<OfferSummary>(`/offers/${id}/summary`);
  }

  updateOfferProgress({progress}, id: number) {
    return this.http.patch(`/offers/${id}/update-progress/`, {progress})
      .pipe(
        tap(() => {
          if (progress > this.currentOffer.progress) {
            this.currentOffer.progress = progress;
          }
          this.offerChanged$.next(this.currentOffer);
        })
      );
  }

  signOffer(offerId: number): Observable<any> {
    return this.http.post(`/offers/${offerId}/sign/`, {})
      .pipe(
        tap(() => this.currentOffer.isSigned = true)
      );
  }

  rejectOffer(offerId: number): Observable<any> {
    return this.http.post(`/offers/${offerId}/reject/`, {});
  }

  loadCalendar(start?: Date, end?: Date): Observable<CalendarEvent[]> {
    return this.fetchCalendarData(ApiEndpoint.Calendar, start, end);
  }

  loadCalendarByOffer(id: number, start?: Date, end?: Date): Observable<CalendarEvent[]> {
    const url = super.transformEndpoint(ApiEndpoint.TransactionCalendar, id);
    return super.fetchCalendarData(url, start, end);
  }

  documentOpenedEvent(id: number): Observable<any> {
    const url = `${ApiEndpoint.Offer}${id}/pdf`;
    return this.http.post(url, null);
  }

  getClassName(status: AgreementStatus): string {
    switch (status) {
      case AgreementStatus.Started:
        return 'blue';
      case AgreementStatus.Delivered:
        return 'orange';
      case AgreementStatus.Countered:
        return 'turquoise';
      case AgreementStatus.Completed:
        return 'violet';
      case AgreementStatus.Denied:
        return 'red';
    }
  }

  // date string === 'MM/dd/yyyy'
  isDateFormat(date: string): boolean {
    const dateReg = /^(?:(0[1-9]|1[012])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](19|20)[0-9]{2})$/;
    return dateReg.test(date);
  }

  // date string === 'yyyy-MM-dd'
  isDateISOFormat(value): boolean {
    const dateReg = /^\d{4}-\d{2}-\d{2}$/;
    return dateReg.test(value);
  }

  convertStringToDate(value): Date {
    const str = value.split('-');
    const dayArray = str[2].split('T');

    const year = Number(str[0]);
    const month = Number(str[1]) - 1;
    const day = Number(dayArray[0]);

    return new Date(year, month, day);
  }
}
