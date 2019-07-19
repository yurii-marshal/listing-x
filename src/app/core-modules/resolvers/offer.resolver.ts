import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Offer } from '../models/offer';
import { catchError } from 'rxjs/operators';
import { OfferService } from '../core-services/offer.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class OfferResolver implements Resolve<Offer> {

  constructor(private http: HttpClient,
              private offerService: OfferService,
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

    const data = this.offerService.anonymousOfferData;
    if (data) {
      return data.offer;
    }

    return null;
  }
}
