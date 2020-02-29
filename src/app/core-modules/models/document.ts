import { UploadDocumentType } from '../enums/upload-document-type';

export interface Document {
  id: number;
  file: string; // TODO: encoded value
  title: string;
  documentType: UploadDocumentType;
  extension: string;
  checked?: boolean;
}
