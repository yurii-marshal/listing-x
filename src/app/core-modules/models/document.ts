import {GeneratedDocumentType, UploadDocumentType} from '../enums/upload-document-type';
import {DocumentStatus} from '../enums/document-status';
import {SpqQuestion} from './spq-question';
import { Log } from './transaction';

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
  lastEvent: Log;
  file: string;
  title: string;
  extension: string;
  // url: string;
  allowSign: boolean;
  allowEdit: boolean;
  transaction: number;
  documentData?: SpqDocumentData | AddendumData;
  createdAt: string;
  /** @deprecated */
  checked: boolean;
}

export interface SpqDocumentData {
  questions: SpqQuestion[];
  explanation: string;
}

export interface AddendumData {
  id?: number;
  addendumName: string;
  terms: string;
}
