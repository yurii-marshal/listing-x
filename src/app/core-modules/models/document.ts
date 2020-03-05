import { UploadDocumentType } from '../enums/upload-document-type';
import {DocumentStatus} from '../enums/document-status';

export interface Document {
  id: number;
  documentType: UploadDocumentType;
  file: string; // TODO: encoded value
  title: string;
  extension: string;
  checked?: boolean;
  url?: string;
}

export class GeneratedDocument implements Document {
  status: DocumentStatus;
  checked: boolean;
  documentType: UploadDocumentType;
  extension: string;
  file: string;
  id: number;
  title: string;
  url: string;
}
