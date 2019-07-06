import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthEndpoints } from '../enums/auth-endpoints';
import * as moment from 'moment';
import { User } from '../../feature-modules/auth/models';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Jwt } from '../enums/jwt';
import { Observable, of } from 'rxjs';
import { JwtResponse } from '../interfaces/jwt-response';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;

  constructor(private http: HttpClient) {
  }

  /** @Deprecated */
  private get expirationTm() {
    const expiration = localStorage.getItem(Jwt.Expiration);
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  private get expirationTime(): moment.Moment {
    const base64Token = localStorage.getItem(Jwt.Token);
    if (base64Token) {
      const [header, payload, signature] = _.split(base64Token, '.');
      const decodedPayload = JSON.parse(atob(payload));
      const expiresAt: number = _.get(decodedPayload, 'exp');
      return moment.unix(expiresAt);
    }
    return null;
  }


  private get jwtToken(): string {
    return localStorage.getItem(Jwt.Token);
  }

  // TODO: return moment().isBefore(this.expirationTime);
  isLoggedIn(): Observable<boolean> {
    if (!this.jwtToken) {
      return of(false);
    }

    return this.http.post<boolean>(AuthEndpoints.Verify, {token: this.jwtToken})
      .pipe(
        map(data => !!data),
        catchError(() => of(false)),
      );
  }

  login(user: User): Observable<JwtResponse> {
    return this.http.post<any>(AuthEndpoints.Login, user.serializeLogin())
      .pipe(
        tap(resp => this.setSession(resp)),
      );
  }

  register(user: User): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(AuthEndpoints.Register, user.serialize());
    // .pipe(
    //   tap(resp => this.setSession(resp)),
    // );
  }

  resendActivation(email: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(AuthEndpoints.ResendActivation, {email});
  }

  activate(token: string): Observable<boolean> {
    const url = AuthEndpoints.ActivateAccount + token + '/';
    return this.http.get<boolean>(url);
  }

  refreshToken(): Observable<JwtResponse> {
    const token = this.jwtToken;
    return this.http.post<JwtResponse>(AuthEndpoints.RefreshToken, {token})
      .pipe(
        tap(resp => this.setSession(resp)),
      );
  }

  requestNewPassword(email: string) {
    return this.http.post<any>(AuthEndpoints.ForgotPassword, {email});
  }

  resetPassword(password: string, token: string) {
    return this.http.post<any>(AuthEndpoints.ResetPassword, {password, token});
  }

  logout() {
    localStorage.removeItem(Jwt.Token);
    localStorage.removeItem(Jwt.Expiration);
  }

  private setSession(resp: JwtResponse): void {
    const unix = +resp[Jwt.Expiration];
    const expiresAt: moment.Moment = moment.unix(unix).add(1, 'second');
    const unixTimestamp: number = expiresAt.valueOf(); // in ms.
    localStorage.setItem(Jwt.Token, resp[Jwt.Token]);
    localStorage.setItem(Jwt.Expiration, JSON.stringify(unixTimestamp));
  }
}
