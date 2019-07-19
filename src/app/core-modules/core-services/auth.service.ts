import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoint, AuthEndpoints } from '../enums/auth-endpoints';
import * as moment from 'moment';
import { User } from '../../feature-modules/auth/models';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { LocalStorageKey } from '../enums/local-storage-key';
import { Observable, of } from 'rxjs';
import { JwtResponse } from '../interfaces/jwt-response';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;

  constructor(private http: HttpClient) {
  }

  /** @Deprecated */
  private get expirationTm() {
    const expiration = localStorage.getItem(LocalStorageKey.Expiration);
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  private get expirationTime(): moment.Moment {
    const base64Token = localStorage.getItem(LocalStorageKey.Token);
    if (base64Token) {
      const [header, payload, signature] = _.split(base64Token, '.');
      const decodedPayload = JSON.parse(atob(payload));
      const expiresAt: number = _.get(decodedPayload, 'exp');
      return moment.unix(expiresAt);
    }
    return null;
  }


  private get jwtToken(): string {
    return localStorage.getItem(LocalStorageKey.Token);
  }

  // TODO: return moment().isBefore(this.expirationTime);
  isLoggedIn(): Observable<boolean> {
    if (!this.jwtToken) {
      return of(false);
    } else if(this.currentUser) {
      return of(true);
    }

    return this.http.post<boolean>(AuthEndpoints.Verify, {token: this.jwtToken})
      .pipe(
        switchMap(() => this.http.get<User>(ApiEndpoint.CurrentUser)),
        tap(user => this.currentUser = user),
        map(data => !!data),
        catchError(() => of(false)),
      );
  }

  login(user: User): Observable<JwtResponse> {
    return this.http.post<any>(AuthEndpoints.Login, user)
      .pipe(
        tap(resp => this.setSession(resp)),
      );
  }

  register(user: User): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(AuthEndpoints.Register, user);
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
    return this.http.post<any>(AuthEndpoints.ResetPassword, {token, new_password: password});
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(LocalStorageKey.Token);
    localStorage.removeItem(LocalStorageKey.Expiration);
  }

  private setSession(resp: JwtResponse): void {
    const unix = +resp[LocalStorageKey.Expiration];
    const expiresAt: moment.Moment = moment.unix(unix).add(1, 'second');
    const unixTimestamp: number = expiresAt.valueOf(); // in ms.
    localStorage.setItem(LocalStorageKey.Token, resp[LocalStorageKey.Token]);
    localStorage.setItem(LocalStorageKey.Expiration, JSON.stringify(unixTimestamp));
  }
}
