import { IDataService } from '../interfaces/data.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ConfirmationBarComponent } from '../../shared-modules/components/confirmation-bar/confirmation-bar.component';
import { switchMap, tap } from 'rxjs/operators';
import { ApiEndpoint } from '../enums/api-endpoints';

/*
* Base CRUD dataservice
* */
export abstract class BaseDataService<TModel extends {id: number}> implements IDataService<TModel> {
  protected snackbar: MatSnackBar;
  protected http: HttpClient;

  protected detailUrl(id: number): string {
    return `${this.crudEndpoint}${id}/`
  }

  protected transformEndpoint(endpoint: ApiEndpoint, id: any): string {
    return endpoint.replace('{id}', id);
  }

  constructor(protected injector: Injector,
              protected crudEndpoint: ApiEndpoint) {

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

}
