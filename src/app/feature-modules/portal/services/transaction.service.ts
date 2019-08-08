import { Injectable, Injector } from '@angular/core';
import { IDataService } from '../../../core-modules/interfaces/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CalendarEvent, Transaction } from '../../../core-modules/models/transaction';
import { Observable, of } from 'rxjs';
import { detailUrl } from '../../../core-modules/utils/util';
import { ApiEndpoint } from '../../../core-modules/enums/api-endpoints';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BaseDataService } from '../../../core-modules/base-classes/base-data-service';

@Injectable()
export class TransactionService extends BaseDataService<Transaction> {
  private today = moment().utcOffset(0);

  protected crud: ApiEndpoint = ApiEndpoint.Transactions;

  constructor(protected injector: Injector) {
    super(injector);
  }


  // TODO: refactor
  loadList(params?: HttpParams): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(ApiEndpoint.Transactions, {params});
  }

  // TODO: refactor
  loadOne(id: number): Observable<Transaction> {
    const url: string = detailUrl(ApiEndpoint.Transactions, id);
    return this.http.get<Transaction>(url);
  }

  loadCalendar(start?: Date, end?: Date): Observable<CalendarEvent[]> {
    return this.fetchCalendarData(ApiEndpoint.Calendar, start, end);
  }

  loadCalendarByTransaction(id: number, start?: Date, end?: Date): Observable<CalendarEvent[]> {
    const url = `/transactions/${id}/calendar/`;
    return this.fetchCalendarData(url, start, end);
  }

  inviteUser(email: string): Observable<void> {
    // TODO:
    return of(null);
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
