import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { AuthService } from '../core-services/auth.service';

@Injectable()
export class ActivationResolver implements Resolve<boolean> {

  constructor(private service: AuthService,
              private router: Router) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = route.paramMap.get('token');
    return this.service.activate(token)
      .pipe(
        tap({
          next: () => this.router.navigate(['/auth/login'], { queryParams: {activated: true}}),
          error: err => this.router.navigate(['/error/expired'])
        }),
        first()
      );

    // Router waits for the observable to close.
    // We ensure it gets closed after the first value is emitted, by using the first() operator.
}

}
