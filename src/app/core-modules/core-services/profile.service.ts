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
  private user: User;

  constructor(private authService: AuthService,
              private http: HttpClient) {
    this.user = this.authService.currentUser;
  }

  get isProfileCompleted() {
    return this.user.account_type === 'agent' ? this.user.registration_finished : true;
  }

  public updateProfile(profile: User): Observable<User> {
    return this.http.put<User>(ProfileEndpoint.Update, {profile});
  }
}
