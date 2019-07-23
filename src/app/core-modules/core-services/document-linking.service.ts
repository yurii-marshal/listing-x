import { Injectable } from '@angular/core';
import { IDataService } from '../interfaces/data.service';
import { Document } from '../models/document';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UploadDocumentType } from '../enums/upload-document-type';
import { ApiEndpoint } from '../enums/auth-endpoints';
import { map } from 'rxjs/operators';
import { LinkedDocuments } from '../models/linked-documents';

@Injectable()
export class DocumentLinkingService {

  constructor(private http: HttpClient) { }

  loadOfferDocuments(offerId: number): Observable<LinkedDocuments> {
    return this.http.get<any>(`/offers/${offerId}/documents/`);
  }

  linkDocumentsToOffer(model: LinkedDocuments): Observable<LinkedDocuments> {
    return this.http.post<LinkedDocuments>(`/offers/${model.offerId}/documents/`, model);
  }

  loadListDocumentsByType(type: UploadDocumentType): Observable<Document[]> {
    return this.http.get<any>(ApiEndpoint.Upload,  {params: new HttpParams().set('type', type)})
      .pipe(map((body: any) => body.results as Document[]));
  }

  /**
   * Multiple file upload
   * */
  upload(files: File[], type?: UploadDocumentType): Observable<Document[]> {
    const formData: FormData = new FormData();
    if (files.length) {
      files.forEach((file: File) => formData.append('files', file));
    }
    const params = new HttpParams();
    if (type) {
      params.set('type', type);
    }
    return this.http.post(ApiEndpoint.Upload, formData, {params})
      .pipe(map((body: any) => body.results as Document[]));
  }

}
