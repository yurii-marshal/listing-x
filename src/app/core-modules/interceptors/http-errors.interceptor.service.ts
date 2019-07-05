import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import { HttpStatusCodes } from '../enums/http-status-codes';
import { AuthEndpoints } from '../enums/auth-endpoints';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorsInterceptor implements HttpInterceptor {
  private readonly excluded: AuthEndpoints[] = [
    AuthEndpoints.Verify,
    AuthEndpoints.ForgotPassword
  ];

  constructor(private snackBar: MatSnackBar) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (_.some(this.excluded, (endpoint: AuthEndpoints) => _.endsWith(req.url, endpoint))) {
      return next.handle(req); // Exit
    }

    return next.handle(req)
      .pipe(
        tap({error: (err: HttpErrorResponse) => this.globalHttpErrorParser(err)})
      );
  }

  private globalHttpErrorParser(errorResponse: HttpErrorResponse) {
    const code = +errorResponse.status;
    if (code !== HttpStatusCodes.UNAUTHORIZED) {
      const msg = _.values(errorResponse.error).join('\n');
      this.snackBar.open(msg || 'Something went wrong', 'OK', {
        duration: 5000,
        panelClass: 'error-bar'
      });
    }
  }
}
