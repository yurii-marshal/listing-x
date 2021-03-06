import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { OfferService } from '../../feature-modules/portal/services/offer.service';
import { Offer } from '../models/offer';

@Injectable()
export class GetOfferResolver implements Resolve<Offer> {

  constructor(private offerService: OfferService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Offer> {
    return this.offerService.loadOne(+route.params.id)
      .pipe(
        tap({
          next: (offer) => {
            this.offerService.currentOffer = offer;

            if (route.data && route.data.progress) {
              if (offer.progress < route.data.progress) {
                this.router.navigateByUrl('/portal/purchase-agreements/all');
              }
            }

            return offer;
          },
          error: err => this.router.navigateByUrl('/portal/purchase-agreements/all')
        }),
        first()
      );
  }

}
