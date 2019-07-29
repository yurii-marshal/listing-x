import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Offer, OfferSummary } from '../../../core-modules/models/offer';
import { catchError } from 'rxjs/operators';
import { OfferService } from '../../../core-modules/core-services/offer.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../../core-modules/core-services/auth.service';

@Injectable()
export class OfferSummaryResolver implements Resolve<Offer> {

  constructor(private http: HttpClient,
              private offerService: OfferService,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OfferSummary> | OfferSummary {
    const id = route.parent.params.id || route.params.id;
    const offerId: number = Number(id);
    if (isNaN(offerId)) {
      return null;
    }

    return this.offerService.loadOfferSummary(offerId)
      .pipe(
        catchError(err => {
          this.router.navigate(['../']);
          this.snackBar.open(`Cannot retrieve offer.`, 'OK', {duration: 7000, panelClass: 'error-bar'});
          return of(null);
        })
      );
  }
}
