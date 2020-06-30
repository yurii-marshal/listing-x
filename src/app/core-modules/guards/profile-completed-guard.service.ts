import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProfileService } from '../core-services/profile.service';

@Injectable()
export class ProfileCompletedGuardService implements CanActivate {

  constructor(private profileService: ProfileService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return of(this.profileService.isProfileCompleted);
  }
}
