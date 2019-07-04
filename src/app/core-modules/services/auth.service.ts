import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoint } from '../enums/api-endpoint';
import * as moment from 'moment';
import { User } from '../../feature-modules/auth/models';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Jwt } from '../enums/jwt';
import { Observable, of } from 'rxjs';
import { JwtResponse } from '../interfaces/jwt-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;

  constructor(private http: HttpClient) {
  }

  private get expirationTime() {
    const expiration = localStorage.getItem(Jwt.Expiration);
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  private get jwtToken(): string {
    return localStorage.getItem(Jwt.Token);
  }

  // TODO: return moment().isBefore(this.expirationTime);
  isLoggedIn(): Observable<boolean> {
    if (!this.jwtToken) {
      return of(false);
    }

    return this.http.post<boolean>(ApiEndpoint.Verify, {token: this.jwtToken})
      .pipe(
        map(data => !!data),
        catchError(() => of(false)),
      );
  }

  login(user: User): Observable<JwtResponse> {
    return this.http.post<any>(ApiEndpoint.Login, user.serializeLogin())
      .pipe(
        tap(resp => this.setSession(resp)),
      );
  }

  register(user: User): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(ApiEndpoint.Register, user.serialize());
      // .pipe(
      //   tap(resp => this.setSession(resp)),
      // );
  }

  activate(token: string): Observable<boolean> {
    const url = ApiEndpoint.ActivateAccount + token + '/';
    return this.http.get<boolean>(url);
  }

  refreshToken(): Observable<JwtResponse> {
    const token = this.jwtToken;
    return this.http.post<JwtResponse>(ApiEndpoint.RefreshToken, {token})
      .pipe(
        tap(resp => this.setSession(resp)),
      );
  }

  requestNewPassword(email: string) {
    return this.http.post<any>(ApiEndpoint.Unknown, {email});
  }

  resetPassword(password: string, token: string) {
    return this.http.post<any>(ApiEndpoint.Unknown, {password, token});
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
