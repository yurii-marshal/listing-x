import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OfferService } from '../../feature-modules/portal/services/offer.service';
import { AuthService } from '../core-services/auth.service';
import { Offer } from '../models/offer';

@Injectable()
export class CreateOfferGuardService implements CanActivate, CanActivateChild {

  constructor(private offerService: OfferService,
              private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const redirectUrl = '/portal/purchase-agreements/step-one';
    return this.offerService.loadOne(+route.params.id)
      .pipe(
        map((offer: Offer) => offer.userRole === 'agent_buyer'),
        catchError(() => of(this.router.parseUrl(redirectUrl)))
      );
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
