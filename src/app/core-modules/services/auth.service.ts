import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoint } from '../enums/api-endpoint';
import * as moment from 'moment';
import { User } from '../../feature-modules/auth/models';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Jwt } from '../enums/jwt';
import { Observable } from 'rxjs';
import { JwtResponse } from '../interfaces/jwt-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  get expirationTime() {
    const expiration = localStorage.getItem(Jwt.Expiration);
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  isLoggedIn(): Observable<boolean> {
    const token = localStorage.getItem(Jwt.Token);
    return this.http.post<boolean>(ApiEndpoint.Verify, {token})
      .pipe(
        map(data => !!data)
      );
    // TODO: return moment().isBefore(this.expirationTime);
  }

  login(user: User): Observable<{token: string}> {
    return this.http.post<any>(ApiEndpoint.Login, user.serializeLogin())
      .pipe(
        tap(resp => this.setSession(resp)),
      );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(ApiEndpoint.Register, user.serialize())
      .pipe(
        tap(resp => this.setSession(resp)),
      );
  }

  refreshToken(): Observable<JwtResponse> {
    const token = localStorage.getItem(Jwt.Token);
    return this.http.post<JwtResponse>(ApiEndpoint.RefreshToken, {token})
      .pipe(
        tap(resp => this.setSession(resp)),
      );
  }

  requestNewPassword(email: string) {
    return this.http.post<any>(ApiEndpoint.Unknown, {email});
  }

  logout() {
    localStorage.removeItem(Jwt.Token);
    localStorage.removeItem(Jwt.Expiration);
  }

  private setSession(resp: any): void {
    const expiresAt: moment.Moment = moment().add(resp[Jwt.Expiration], 'second');
    const unixTimestamp: number = expiresAt.valueOf(); // in ms
    localStorage.setItem(Jwt.Token, resp[Jwt.Token]);
    localStorage.setItem(Jwt.Expiration, JSON.stringify(unixTimestamp));
  }
}
