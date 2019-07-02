import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../enums/api-endpoint';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private readonly excluded: ApiEndpoint[] = [
    ApiEndpoint.Login,
    ApiEndpoint.Register
  ];

  constructor(private snackBar: MatSnackBar) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({url: this.getApiURL(req.url)});


    if (this.excluded.some((endpoint: ApiEndpoint) => req.url.includes(endpoint))) {
      return next.handle(req); // Ignore
    }

    const token = localStorage.getItem('token');
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }

    return next.handle(req)
      .pipe(
        // TODO: refresh token logic for 401 status code
      );
  }

  private globalHttpErrorParser(event: HttpEvent<any>) {
    if (event instanceof HttpResponse) {
      const httpResponse = event as HttpResponse<any>;
      const code = httpResponse.body.ReturnCode;
      if (parseFloat(code) >= 400) {
        const responseMessage = httpResponse.body.ResponseMessage;
        this.snackBar.open(responseMessage, 'OK', {duration: 5000});
      }
    }
  }

  private getApiURL(url: string): string {
    if (url.includes(environment.API_BASE_URL)) {
      return url;
    }
    return environment.API_BASE_URL + url;
  }
}
