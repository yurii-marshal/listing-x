import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Offer } from '../../core-modules/models/offer';
import { OfferService } from '../portal/services/offer.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class AnonymousOfferResolver {

  constructor(private service: OfferService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Offer> | Offer {
    const token = route.params.token;
    return this.service.getAnonymousOffer(token)
      .pipe(
        tap({error: err => this.router.navigateByUrl('/error/expired')})
      );
  }
}