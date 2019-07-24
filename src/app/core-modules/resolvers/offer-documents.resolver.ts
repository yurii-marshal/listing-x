import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OfferService } from '../core-services/offer.service';
import { AuthService } from '../core-services/auth.service';
import { MatSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';
import { LinkedDocuments } from '../models/linked-documents';
import { catchError, map } from 'rxjs/operators';
import { DocumentLinkingService } from '../core-services/document-linking.service';

@Injectable()
export class OfferDocumentsResolver implements Resolve<LinkedDocuments> {

  constructor(private http: HttpClient,
              private service: DocumentLinkingService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LinkedDocuments> | LinkedDocuments {
    const offerId: number = Number(route.parent.params.id);
    if (isNaN(offerId)) {
      return null;
    }

    return this.service.loadOfferDocuments(offerId)
      .pipe(
        map(model => ({...model, offerId})), // inject model id
        catchError(err => of(null))
      );
  }
}
