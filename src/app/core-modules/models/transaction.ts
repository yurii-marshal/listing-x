import { OfferSummary } from './offer';
import { GeneratedDocument } from './document';

export interface Transaction {
  id: number;
  createdAt: string;
  status: TransactionStatus;
  lastLogs: Log[];
  offer: OfferSummary;
  documents: GeneratedDocument[];
  /** @deprecated **/
  urlDocument: string;
  allowEdit: boolean;
  allowDelete: boolean;
  allowSign: boolean;
  allowDeny: boolean;
  allowInvite: boolean;
}

export enum TransactionStatus {
  All = 'all_transactions',
  New = 'new',
  InProgress = 'in_progress',
  Finished = 'finished'
}

export interface CalendarEvent {
  date: Date;
  event: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface Log {
  createdAt: string;
  id: number;
  title: string;
}
