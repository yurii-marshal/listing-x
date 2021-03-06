import { Injectable } from '@angular/core';
import { Document } from '../../../core-modules/models/document';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { LinkedDocuments } from '../../../core-modules/models/linked-documents';
import { MatSnackBar } from '@angular/material';
import { UploadDocumentType } from '../../../core-modules/enums/upload-document-type';
import { ApiEndpoint } from '../../../core-modules/enums/api-endpoints';
import { TransactionService } from './transaction.service';

@Injectable()
export class DocumentLinkingService {

  constructor(private http: HttpClient,
              private snackbar: MatSnackBar,
              private transactionService: TransactionService) {
  }

  loadOfferDocuments(offerId: number): Observable<LinkedDocuments> {
    return this.http.get<any>(`/offers/${offerId}/documents/`);
  }

  linkDocumentsToOffer(model: LinkedDocuments, offerId: number): Observable<LinkedDocuments> {
    return this.http.post<LinkedDocuments>(`/offers/${offerId}/documents/`, model);
  }

  updateOfferDocuments(model: LinkedDocuments): Observable<LinkedDocuments> {
    return this.http.put<LinkedDocuments>(`/offers/${model.offerId}/documents/`, model).pipe(
      tap(() => this.transactionService.transactionChanged.next())
    );
  }

  loadListDocumentsByType(type: UploadDocumentType, offerId: number = null): Observable<Document[]> {
    const params = {document_type: type};
    if (offerId) {
      params['offer_id'] = offerId;
    }
    return this.http.get<any>(ApiEndpoint.Upload, {params})
      .pipe(map((body: any) => body.results as Document[]));
  }

  /**
   * Multiple file upload
   */
  upload(files: File[], type?: UploadDocumentType): Observable<Document[]> {
    const formData: FormData = new FormData();
    if (files.length) {
      files.forEach((file: File) => formData.append('files', file));
    }
    let params = new HttpParams();
    if (type) {
      params = params.set('type', type);
    }
    return this.http.post(ApiEndpoint.Upload, formData, {params})
      .pipe(
        map((body: any) => body.results as Document[]),
        tap(() => this.snackbar.open(`Successfully uploaded ${files.length} file(s).`))
      );
  }

}
