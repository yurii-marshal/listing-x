import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import { HttpStatusCodes } from '../enums/http-status-codes';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AuthEndpoint } from '../enums/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorsInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap({error: (err: HttpErrorResponse) => this.globalHttpErrorParser(err)})
      );
  }

  private globalHttpErrorParser(errorResponse: HttpErrorResponse) {
    const code = errorResponse.status;
    const authUrls: string[] = Object.values(AuthEndpoint);
    const isAuthEndpoint: boolean = _.some(authUrls, (uri: string) => _.endsWith(errorResponse.url, uri));
    if (code === HttpStatusCodes.BAD_REQUEST && isAuthEndpoint) {
      return; // Ignore form's errors
    }

    let msg = '';
    if (code === HttpStatusCodes.UNAUTHORIZED) {
      msg = 'Your session has expired. Please login again to continue working.';
      this.router.navigate(['/auth/login']);
    } else if (code === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
      msg = 'Internal server error'
    } else  {
      msg = this.formatMsg(errorResponse)
    }

    this.snackBar.open(msg || 'Something went wrong', 'OK', {duration: 7000, panelClass: 'error-bar'});
  }

  private formatMsg(errorResponse: HttpErrorResponse) {
    return _.chain(errorResponse.error)
      .mapValues((value, key) => `${key}: ${value}`)
      .values()
      .join('\n')
      .truncate({length: 100})
      .value();
  }
}
