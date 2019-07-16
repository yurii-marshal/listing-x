import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageKey } from '../enums/local-storage-key';
import { Offer } from '../models/offer';
import { ApiEndpoint } from '../enums/auth-endpoints';
import { switchMap, tap } from 'rxjs/operators';
import { OfferService } from '../core-services/offer.service';

@Injectable()
export class OfferResolver implements Resolve<Offer> {

  constructor(private http: HttpClient,
              private offerService: OfferService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Offer> | Offer {
    const raw: string = localStorage.getItem(LocalStorageKey.Offer);
    if (raw) {
      const o = JSON.parse(raw);
      const model = new Offer(o.offer);
      const token = o.token; // from generation link
      return this.offerService.add(model, token)
        .pipe(
          tap(() => localStorage.removeItem(LocalStorageKey.Offer)),
          switchMap(({id}) => this.offerService.loadOne(id))
        );
    }
    return this.offerService.loadOne(1); //Fixme
  }
}
