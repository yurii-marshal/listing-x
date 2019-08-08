import { IDataService } from '../interfaces/data.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ConfirmationBarComponent } from '../../shared-modules/components/confirmation-bar/confirmation-bar.component';
import { switchMap, tap } from 'rxjs/operators';
import { ApiEndpoint } from '../enums/api-endpoints';
import { detailUrl } from '../utils/util';

@Injectable()
export abstract class BaseDataService<TModel> implements IDataService<TModel> {
  protected snackbar: MatSnackBar;
  protected http: HttpClient;

  constructor(protected injector: Injector) {
    this.snackbar = injector.get(MatSnackBar);
    this.http = injector.get(HttpClient);
  }

  protected abstract get crud(): ApiEndpoint;

  add(model: TModel): Observable<TModel> {
    return undefined;
  }

  delete(id: number): Observable<void> {
    const config: MatSnackBarConfig = {
      data: {
        message: 'Are you sure want to delete?',
        dismiss: 'Cancel',
      },
      duration: 0
    };
    const snackBarRef = this.snackbar.openFromComponent(ConfirmationBarComponent, config);
    const url: string = detailUrl(this.crud, id);
    return snackBarRef.onAction()
      .pipe(
        switchMap(() => this.http.delete<void>(url)),
        tap(() => this.snackbar.open('Successfully deleted item.'))
      );
  }

  loadList(params?: HttpParams): Observable<TModel[]> {
    return undefined;
  }

  loadOne(id: number): Observable<TModel> {
    return undefined;
  }

  update(model: TModel): Observable<TModel> {
    return undefined;
  }

}
