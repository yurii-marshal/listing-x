import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import { HttpStatusCodes } from '../enums/http-status-codes';
import { AuthEndpoints } from '../enums/auth-endpoints';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorsInterceptor implements HttpInterceptor {
  private readonly excluded: AuthEndpoints[] = [
  ];

  constructor(private snackBar: MatSnackBar,
              private router: Router) {
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
    const code = errorResponse.status;
    if (code === HttpStatusCodes.BAD_REQUEST) {
      return; // Ignore form's errors
    }

    let msg = '';
    if (code === HttpStatusCodes.UNAUTHORIZED) {
      msg = 'Your session has expired. Please login again to continue working.';
      this.router.navigateByUrl('/auth/login');
    } else  {
      msg = _.values(errorResponse.error).join('\n');
      msg = _.truncate(msg, {length: 60});
    }

    this.snackBar.open(msg || 'Something went wrong', 'OK', {
      duration: 7000,
      panelClass: 'error-bar'
    });
  }
}
