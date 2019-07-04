import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { HttpStatusCodes } from '../enums/http-status-codes';

@Injectable()
export class ActivationResolver implements Resolve<boolean> {

  constructor(private service: AuthService,
              private router: Router) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = route.paramMap.get('token');
    return this.service.activate(token)
      .pipe(
        map(resp => !resp),
        catchError(err => {
          if (err.status === HttpStatusCodes.FORBIDDEN) {
            this.router.navigate(['/forbidden']);
          }
          return of(false);
        }),
        first()
      );

    // Router waits for the observable to close.
    // We ensure it gets closed after the first value is emitted, by using the first() operator.
}

}
