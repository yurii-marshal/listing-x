import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Offer, Person } from '../models/offer';
import { catchError, map } from 'rxjs/operators';
import { OfferService } from '../core-services/offer.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../core-services/auth.service';
import * as _ from 'lodash';

@Injectable()
export class OfferResolver implements Resolve<Offer> {

  constructor(private http: HttpClient,
              private offerService: OfferService,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Offer> | Offer {
    const offerId: number = Number(route.queryParams.offerId);
    if (!isNaN(offerId)) {
      const config = {duration: 7000, panelClass: 'error-bar'};
      return this.offerService.loadOne(offerId)
        .pipe(
          catchError(err => {
            this.router.navigate(['../']);
            this.snackBar.open(`Cannot retrieve offer.`, 'OK', config);
            return of(null);
          })
        );
    }

    const data = this.offerService.anonymousOfferData; // LS data
    if (data) {
      return this.overwriteFirstBuyer(data.offer);
    }

    return null;
  }

  /*
  * Overwrite first bayes with user's profile credentials
  * */
  private overwriteFirstBuyer(offer: Offer) {
    const buyer: Person = _.pick(this.authService.currentUser, ['firstName', 'lastName', 'email']);
    if (_.isEmpty(offer.buyers)) {
      offer.buyers = [buyer];
    } else {
      offer.buyers[0] = buyer;
    }
    return offer;
  }
}
