import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoint } from '../enums/api-endpoint';
import * as moment from 'moment';
import { User } from '../../feature-modules/auth/models';
import { shareReplay, tap } from 'rxjs/operators';
import { Jwt } from '../enums/jwt';
import { Observable } from 'rxjs';

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

  isLoggedIn(): boolean {
    return moment().isBefore(this.expirationTime);
  }

  login(user: User) {
    return this.http.post<any>(ApiEndpoint.Login, user.serializeLogin())
      .pipe(
        tap(resp => this.setSession(resp)),
        shareReplay()
      );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(ApiEndpoint.Register, user.serialize())
      .pipe(
        tap(resp => this.setSession(resp)),
        shareReplay()
      );
  }

  refreshToken(): Observable<any> {
    const token = localStorage.getItem(Jwt.Token);
    return this.http.post<any>(ApiEndpoint.RefreshToken, {token})
      .pipe(
        tap(resp => this.setSession(resp)),
        shareReplay()
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
