import {Injectable, Injector} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {CalendarEvent, Transaction} from '../../../core-modules/models/transaction';
import {Observable, Subject} from 'rxjs';
import {ApiEndpoint} from '../../../core-modules/enums/api-endpoints';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import {BaseDataService} from '../../../core-modules/base-classes/base-data-service';
import {GeneratedDocument} from '../../../core-modules/models/document';
import {SpqQuestion} from '../../../core-modules/models/spq-question';

@Injectable()
export class TransactionService extends BaseDataService<Transaction> {
  private today = moment().utcOffset(0);
  transactionChanged: Subject<void> = new Subject<void>();

  constructor(protected injector: Injector) {
    super(injector, ApiEndpoint.Transactions);
  }

  // loadSignDocument(transactionId: number): Observable<Transaction> {
  loadSignDocument(transactionId: number): Observable<GeneratedDocument> {
    const url: string = this.transformEndpoint(ApiEndpoint.ESignature, transactionId);
    return this.http.get<GeneratedDocument>(url);
  }

  loadCalendar(start?: Date, end?: Date): Observable<CalendarEvent[]> {
    return this.fetchCalendarData(ApiEndpoint.Calendar, start, end);
  }

  loadCalendarByTransaction(id: number, start?: Date, end?: Date): Observable<CalendarEvent[]> {
    const url = super.transformEndpoint(ApiEndpoint.TransactionCalendar, id);
    return this.fetchCalendarData(url, start, end);
  }

  documentOpenedEvent(id: number): Observable<any> {
    const url = `${ApiEndpoint.Transactions}${id}/pdf`;
    return this.http.post(url, null);
  }

  inviteUser(transactionId: number, email: string): Observable<void> {
    const url = super.transformEndpoint(ApiEndpoint.InviteUser, transactionId);
    return this.http.post<void>(url, {email});
  }

  lockOffer(transactionId: number): Observable<void> {
    const url = super.transformEndpoint(ApiEndpoint.LockOffer, transactionId);
    return this.http.post<void>(url, {});
  }

  // sign(transactionId: number) {
  //   const url = `${ApiEndpoint.Sign}${transactionId}`;
  //   return this.http.post(url, {});
  // }

  sign(doc: GeneratedDocument): Observable<any> {
    const url = super.transformEndpoint(ApiEndpoint.ESignature, doc.id);
    return this.http.post(url, doc);
  }

  deny(transactionId: number) {
    const url = super.transformEndpoint(ApiEndpoint.Deny, transactionId);
    return this.http.post(url, {});
  }

  toggleState(transactionId: number) {
    const url = super.transformEndpoint(ApiEndpoint.ToggleState, transactionId);
    return this.http.post(url, {});
  }

  updateSpq(docId: number, data: {questions: SpqQuestion[], explanation: string}): Observable<any> {
    const url = super.transformEndpoint(ApiEndpoint.ESignatureSPQ, docId);
    return this.http.put(url, data);
  }

  private fetchCalendarData(url: string, start: Date, end: Date) {
    let params = new HttpParams();
    if (start) {
      params = params.set('start_date', start.toISOString());
    }
    if (end) {
      params = params.set('end_date', end.toISOString());
    }
    return this.http.get<CalendarEvent[]>(url, {params})
      .pipe(
        map(events => _.map(events, event => this.wrapCalendarEvent(event)))
      );
  }

  private wrapCalendarEvent(event: CalendarEvent): CalendarEvent {
    let color: string = '#66ad58';
    if (this.today.isBefore(event.date, 'day')) {
      color = '#cd584a'
    } else if (this.today.isAfter(event.date, 'day')) {
      color = '#f8ce5f'
    }
    return {
      ...event,
      backgroundColor: color,
      borderColor: color
    }
  }
}
