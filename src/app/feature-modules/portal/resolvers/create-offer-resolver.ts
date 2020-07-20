import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Offer } from '../../../core-modules/models/offer';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';

@Injectable()
export class CreateOfferResolver implements Resolve<Offer> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Offer> | Offer {
    return JSON.parse(localStorage.getItem(LocalStorageKey.Offer)) || null;
  }
}
