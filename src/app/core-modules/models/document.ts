import {GeneratedDocumentType, UploadDocumentType} from '../enums/upload-document-type';
import {DocumentStatus} from '../enums/document-status';
import {SpqQuestion} from "./spq-question";

export interface Document {
  id: number;
  documentType: UploadDocumentType;
  file: string; // TODO: encoded value
  title: string;
  extension: string;
  checked?: boolean;
  url?: string;
}

export interface GeneratedDocument {
  id: number;
  documentType: GeneratedDocumentType;
  status: DocumentStatus;
  file: string;
  title: string;
  extension: string;
  url: string;
  allowSign: boolean;
  transaction: number;
  documentData?: SpqQuestion[];
  /** @deprecated */
  checked: boolean;
}
