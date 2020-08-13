import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LinkedDocuments } from '../../../core-modules/models/linked-documents';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DocumentLinkingService } from '../services/document-linking.service';
import { TransactionService } from 'src/app/feature-modules/portal/services/transaction.service';

@Injectable()
export class TransactionDocumentsResolver implements Resolve<LinkedDocuments> {
  constructor(private http: HttpClient,
              private service: DocumentLinkingService,
              private transactionService: TransactionService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LinkedDocuments> | LinkedDocuments {

    return this.transactionService.loadOne(Number(route.parent.params.id))
      .pipe(
        switchMap(data => {
          const offerId = data.offer.id;
          return this.service.loadOfferDocuments(offerId)
            .pipe(
              map(model => ({...model, offerId})), // inject model id
              catchError(err => of(null))
            );
        })
      );
  }
}
