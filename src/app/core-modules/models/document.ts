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
  custom?: boolean;
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
  signatures: Signatures;
  /** @deprecated */
  checked: boolean;
}

export interface Signatures {
  buyers: Signature[];
  sellers: Signature[];
}

export interface Signature {
  email: string;
  signature: string;
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
