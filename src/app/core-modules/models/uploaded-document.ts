import { UploadDocumentType } from '../enums/upload-document-type';

export interface UploadedDocument {
  id: number,
  file: string, // TODO: encoded value
  title: string,
  type: UploadDocumentType
}
