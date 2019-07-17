import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LocalStorageKey } from '../enums/local-storage-key';
import { Offer } from '../models/offer';
import { switchMap, tap } from 'rxjs/operators';
import { OfferService } from '../core-services/offer.service';

@Injectable()
export class OfferResolver implements Resolve<Offer> {

  constructor(private http: HttpClient,
              private offerService: OfferService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Offer> | Offer {
    const raw: string = localStorage.getItem(LocalStorageKey.Offer);
    const offerId: number = Number(route.queryParams.id);
    if (raw) {
      const o = JSON.parse(raw);
      const model = o.offer as Offer;
      const token = o.token; // from generation link
      return this.offerService.add(model, token)
        .pipe(
          // TODO: redirect step2
          // tap(() => localStorage.removeItem(LocalStorageKey.Offer)),
          tap(({id}) => this.router.navigate(['.'], {relativeTo: this.route, queryParams: {id}})),
          switchMap(({id}) => this.offerService.loadOne(id))
        );
    } else if (!isNaN(offerId)) {
      return this.offerService.loadOne(offerId);
    } else {
      return of(null);
    }
  }
}
