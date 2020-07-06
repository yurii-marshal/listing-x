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

@Injectable()
export class CreateOfferGuardService implements CanActivate, CanActivateChild {

  constructor(private offerService: OfferService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const redirectUrl = '/portal/purchase-agreement/step-one';
    return this.offerService.getOfferById(+route.params.id)
      .pipe(
        // TODO: check on step allowing
        map(() => true),
        catchError(() => of(this.router.parseUrl(redirectUrl)))
      );
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
