import { Injectable } from '@angular/core';
import { Document } from '../../../core-modules/models/document';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { LinkedDocuments } from '../../../core-modules/models/linked-documents';
import { MatSnackBar } from '@angular/material';
import { UploadDocumentType } from '../../../core-modules/enums/upload-document-type';
import { ApiEndpoint } from '../../../core-modules/enums/api-endpoints';

@Injectable()
export class DocumentLinkingService {

  constructor(private http: HttpClient,
              private snackbar: MatSnackBar) {
  }

  loadOfferDocuments(offerId: number): Observable<LinkedDocuments> {
    return this.http.get<any>(`/offers/${offerId}/documents/`);
  }

  linkDocumentsToOffer(model: LinkedDocuments): Observable<LinkedDocuments> {
    return this.http.post<LinkedDocuments>(`/offers/${model.offerId}/documents/`, model);
  }

  loadListDocumentsByType(type: UploadDocumentType): Observable<Document[]> {
    return this.http.get<any>(ApiEndpoint.Upload, {params: new HttpParams().set('document_type', type)})
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
