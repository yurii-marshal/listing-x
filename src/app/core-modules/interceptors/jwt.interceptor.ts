import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { JwtResponse } from '../interfaces/jwt-response';
import { LocalStorageKey } from '../enums/local-storage-key';
import { AuthService } from '../core-services/auth.service';
import { AuthEndpoint } from '../enums/api-endpoints';
import * as _ from 'lodash';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private readonly excluded: AuthEndpoint[] = [
    AuthEndpoint.Login,
    AuthEndpoint.Register,
    AuthEndpoint.RefreshToken,
    AuthEndpoint.ForgotPassword,
    AuthEndpoint.ResetPassword
  ];

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({url: this.getApiURL(req.url)});

    if (this.isExcludedEndpoint(req.url)) {
      return next.handle(req); // Exit
    }

    const token = localStorage.getItem(LocalStorageKey.Token);
    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req);
  }


  private isExcludedEndpoint(url: string) {
    if (url.includes(AuthEndpoint.ActivateAccount)) {
      return true;
    }
    return _.some(this.excluded, (endpoint: AuthEndpoint) => url.endsWith(endpoint));
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', `JWT ${token}`)
    });
  }


  private getApiURL(url: string): string {
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    if (!url.endsWith('/')) {
      url += '/';
    }
    if (url.includes(environment.API_BASE_URL)) {
      return url;
    }
    return environment.API_BASE_URL + url;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (this.isRefreshing) {
      return this.refreshTokenSubject
        .pipe(
          filter(token => token != null),
          take(1),
          switchMap(token => next.handle(this.addToken(request, token)))
        );
    } else {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken()
        .pipe(
          tap((resp: JwtResponse) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(resp.token);
          }),
          switchMap((resp: JwtResponse) => next.handle(this.addToken(request, resp.token)))
        );
    }
  }
}
