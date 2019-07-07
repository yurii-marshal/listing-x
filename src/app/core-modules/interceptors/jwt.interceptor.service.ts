import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthEndpoints } from '../enums/auth-endpoints';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { JwtResponse } from '../interfaces/jwt-response';
import { Jwt } from '../enums/jwt';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private readonly excluded: AuthEndpoints[] = [
    AuthEndpoints.Login,
    AuthEndpoints.Register,
    AuthEndpoints.RefreshToken,
    AuthEndpoints.ForgotPassword,
    AuthEndpoints.ResetPassword,
    AuthEndpoints.ActivateAccount
  ];

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({url: this.getApiURL(req.url)});

    if (this.excluded.some((endpoint: AuthEndpoints) => req.url.endsWith(endpoint))) {
      return next.handle(req); // Exit
    }

    const token = localStorage.getItem(Jwt.Token);
    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req);
  }


  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', `JWT ${token}`)
    });
  }


  private getApiURL(url: string): string {
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
