import {Injectable, Injector} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ApiEndpoint} from '../../../core-modules/enums/api-endpoints';
import {tap} from 'rxjs/operators';
import {BaseDataService} from '../../../core-modules/base-classes/base-data-service';
import {AddendumData, GeneratedDocument} from '../../../core-modules/models/document';
import {SpqQuestion} from '../../../core-modules/models/spq-question';
import { CalendarEvent } from '../../../core-modules/models/calendar-event';
import { Agreement } from '../../../core-modules/models/agreement';

@Injectable()
export class AgreementService extends BaseDataService<Agreement> {
  transactionChanged: Subject<void> = new Subject<void>();

  constructor(protected injector: Injector) {
    super(injector, ApiEndpoint.Agreements);
  }

  // loadSignDocument(transactionId: number): Observable<Transaction> {
  loadSignDocument(docId: number): Observable<GeneratedDocument> {
    const url: string = this.transformEndpoint(ApiEndpoint.ESignature, docId);
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
    return this.http.post(url, null).pipe(
      tap(() => this.transactionChanged.next())
    );
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
    return this.http.put(url, data).pipe(
      tap(() => this.transactionChanged.next())
    );
  }

  /* TODO: MODEL */
  createAddendum(transactionId: number, data: AddendumData): Observable<GeneratedDocument> {
    const url = super.transformEndpoint(ApiEndpoint.CreateAddendum, transactionId);
    return this.http.post<GeneratedDocument>(url, data).pipe(
      tap(() => this.transactionChanged.next())
    );
  }

  updateAddendum(data: AddendumData): Observable<GeneratedDocument> {
    const url = super.transformEndpoint(ApiEndpoint.Addendum, data.id);
    return this.http.put<GeneratedDocument>(url, data).pipe(
      tap(() => this.transactionChanged.next())
    );
  }
}
