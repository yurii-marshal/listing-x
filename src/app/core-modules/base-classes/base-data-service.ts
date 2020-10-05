import { IDataService } from '../interfaces/data.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ConfirmationBarComponent } from '../../shared-modules/components/confirmation-bar/confirmation-bar.component';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiEndpoint } from '../enums/api-endpoints';
import { CalendarEvent } from '../models/calendar-event';
import * as _ from 'lodash';
import * as moment from 'moment';

/*
* Base CRUD dataservice
* */
export abstract class BaseDataService<TModel extends { id: number }> implements IDataService<TModel> {
  protected snackbar: MatSnackBar;
  protected http: HttpClient;

  private today = moment().utcOffset(0);

  constructor(
    protected injector: Injector,
    protected crudEndpoint: ApiEndpoint,
  ) {
    this.snackbar = injector.get(MatSnackBar);
    this.http = injector.get(HttpClient);
  }

  loadList(params?: HttpParams): Observable<TModel[]> {
    return this.http.get<TModel[]>(this.crudEndpoint, {params});
  }

  loadOne(id: number): Observable<TModel> {
    const url: string = this.detailUrl(id);
    return this.http.get<TModel>(url);
  }

  add(model: TModel): Observable<TModel> {
    return this.http.post<TModel>(this.crudEndpoint, model);
  }

  update(model: TModel): Observable<TModel> {
    const url: string = this.detailUrl(model.id);
    return this.http.put<TModel>(url, model);
  }

  delete(id: number): Observable<void> {
    const config: MatSnackBarConfig = {
      duration: 0,
      data: {
        message: 'Are you sure want to delete?',
        dismiss: 'Cancel',
      },
    };
    const snackBarRef = this.snackbar.openFromComponent(ConfirmationBarComponent, config);
    const url: string = this.detailUrl(id);
    return snackBarRef.onAction()
      .pipe(
        switchMap(() => this.http.delete<void>(url)),
        tap(() => this.snackbar.open('Successfully deleted item.'))
      );
  }

  fetchCalendarData(url: string, start: Date, end: Date) {
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

  protected detailUrl(id: number): string {
    return `${this.crudEndpoint}${id}/`;
  }

  protected transformEndpoint(endpoint: ApiEndpoint, id: any): string {
    return endpoint.replace('{id}', id);
  }

  private wrapCalendarEvent(event: CalendarEvent): CalendarEvent {
    let color: string = '#66ad58';
    if (this.today.isBefore(event.date, 'day')) {
      color = '#cd584a';
    } else if (this.today.isAfter(event.date, 'day')) {
      color = '#f8ce5f';
    }
    return {
      ...event,
      backgroundColor: color,
      borderColor: color
    };
  }

}
