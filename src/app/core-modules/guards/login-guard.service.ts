import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable()
export class LoginGuardService implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return this.router.parseUrl('portal'); // Transactions
    } else {
      return true;
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
