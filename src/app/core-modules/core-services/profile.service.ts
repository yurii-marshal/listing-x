import { Injectable } from '@angular/core';
import { User } from '../../feature-modules/auth/models';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ProfileEndpoint } from '../enums/api-endpoints';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private authService: AuthService,
              private http: HttpClient) {
  }

  get isProfileCompleted() {
    return this.authService.currentUser.account_type === 'agent' ?
      this.authService.currentUser.registration_finished : true;
  }

  public updateProfile(profile: User): Observable<User> {
    return this.http.put<User>(ProfileEndpoint.Update, {profile});
  }
}
