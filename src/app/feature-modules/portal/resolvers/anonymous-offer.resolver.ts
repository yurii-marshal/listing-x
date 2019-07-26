import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer, Person } from '../../../core-modules/models/offer';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import * as _ from 'lodash';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';

@Injectable()
export class AnonymousOfferResolver implements Resolve<Offer> {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Offer> | Offer {
    const offer = this.getAnonymousOffer();
    if (offer) {
      return this.overwriteFirstBuyer(offer);
    }

    return null;
  }

  private getAnonymousOffer(): Offer {
    const raw: string = localStorage.getItem(LocalStorageKey.Offer);
    if (raw) {
      const o: any = JSON.parse(raw); // from generation link
      return o.offer as Offer;
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
