import { Injectable, Injector } from '@angular/core';
import { User } from '../../feature-modules/auth/models';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../enums/api-endpoints';
import { BaseDataService } from '../base-classes/base-data-service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseDataService<User> {
  isProfileCompleted: boolean = true;

  constructor(private authService: AuthService,
              protected injector: Injector) {
    super(injector, ApiEndpoint.CompleteRegistration);
    // this.authService.getUser().subscribe((user: User) => {
    //   this.isProfileCompleted = user.accountType === 'agent' ? user.registrationFinished : true;
    // });
  }

  update(model: User): Observable<User> {
    return super.update(model);
  }
}
