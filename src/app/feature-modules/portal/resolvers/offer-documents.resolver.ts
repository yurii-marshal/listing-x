import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LinkedDocuments } from '../../../core-modules/models/linked-documents';
import { catchError, map } from 'rxjs/operators';
import { DocumentLinkingService } from '../../../core-modules/core-services/document-linking.service';

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
