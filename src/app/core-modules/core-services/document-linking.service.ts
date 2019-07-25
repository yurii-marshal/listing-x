import { Injectable } from '@angular/core';
import { Document } from '../models/document';
import { forkJoin, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UploadDocumentType } from '../enums/upload-document-type';
import { ApiEndpoint } from '../enums/auth-endpoints';
import { map, switchMap } from 'rxjs/operators';
import { LinkedDocuments } from '../models/linked-documents';
import * as _ from 'lodash';

@Injectable()
export class DocumentLinkingService {

  constructor(private http: HttpClient) {
  }

  loadOfferDocuments(offerId: number): Observable<LinkedDocuments> {
    return this.http.get<any>(`/offers/${offerId}/documents/`);
  }

  linkDocumentsToOffer(model: LinkedDocuments): Observable<LinkedDocuments> {
    return this.http.post<LinkedDocuments>(`/offers/${model.offerId}/documents/`, model);
  }

  loadListDocumentsByType(type: UploadDocumentType): Observable<Document[]> {
    return this.http.get<any>(ApiEndpoint.Upload, {params: new HttpParams().set('type', type)})
      .pipe(map((body: any) => body.results as Document[]));
  }

  /**
   * Retrieve linked documents and fetch related documents for each of type
   */
  loadOfferDocumentsDeep(offerId: number): Observable<any[]> {
    return this.loadOfferDocuments(offerId)
      .pipe(
        switchMap((linkedDocuments: LinkedDocuments) => {
          const streams = _.keys(linkedDocuments).map(type =>
            this.loadListDocumentsByType(UploadDocumentType[type])
              .pipe(
                map(documents => _.filter(documents, doc => _.includes(linkedDocuments[type], doc.id)))
              )
          );
          return forkJoin(streams);
        })
      );
  }

  /**
   * Multiple file upload
   * */
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
      .pipe(map((body: any) => body.results as Document[]));
  }

}
