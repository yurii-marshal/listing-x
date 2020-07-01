import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Offer } from '../../../core-modules/models/offer';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { ProfileService } from '../../../core-modules/core-services/profile.service';

@Injectable()
export class AgentDataResolver implements Resolve<Offer> {

  constructor(private profileService: ProfileService,
              private snackBar: MatSnackBar) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Offer> | Offer {
    const config = {duration: 7000, panelClass: 'error-bar'};
    return this.profileService.getAgent()
      .pipe(
        catchError(err => {
          this.snackBar.open(`Cannot retrieve agent.`, 'OK', config);
          return of(null);
        })
      );
  }
}
