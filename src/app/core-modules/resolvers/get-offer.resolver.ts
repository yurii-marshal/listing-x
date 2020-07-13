import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { OfferService } from '../../feature-modules/portal/services/offer.service';

@Injectable()
export class GetOfferResolver implements Resolve<boolean> {

  constructor(private offerService: OfferService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (route.data && route.data.progress) {
      this.offerService.offerProgress = route.data.progress;
    }

    return this.offerService.getOfferById(+route.params.id)
      .pipe(
        tap({
          next: (offer) => {
            if (offer.progress < this.offerService.offerProgress) {
              offer.progress = this.offerService.offerProgress;
            }
            return offer;
          },
          error: err => this.router.navigateByUrl('/portal/transactions')
        }),
        first()
      );
  }

}
