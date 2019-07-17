import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LocalStorageKey } from '../enums/local-storage-key';
import { Offer } from '../models/offer';
import { switchMap, tap } from 'rxjs/operators';
import { OfferService } from '../core-services/offer.service';
import { AuthService } from '../core-services/auth.service';

@Injectable()
export class OfferResolver implements Resolve<Offer> {

  constructor(private http: HttpClient,
              private offerService: OfferService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Offer> | Offer {
    const offerId: number = Number(route.queryParams.id);

    if (isNaN(offerId)) {
      return of(null);
    }

    return this.offerService.loadOne(offerId);
  }
}
