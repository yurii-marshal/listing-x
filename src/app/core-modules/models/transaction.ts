import { OfferSummary } from './offer';
import { GeneratedDocument } from './document';
import { Log } from './log';

export interface Transaction {
  id: number;
  createdAt: string;
  status: TransactionStatus;
  lastLogs: Log[];
  offer: OfferSummary;
  documents: GeneratedDocument[];
  completedDocuments: GeneratedDocument[];
  pendingDocuments: GeneratedDocument[];
  purchaseAgreements: GeneratedDocument[];
  allowEdit: boolean;
  allowDelete: boolean;
  allowDeny: boolean;
  allowInvite: boolean;
  /** @deprecated **/
  urlDocument: string;
  allowSign: boolean;
}

export enum TransactionStatus {
  All = 'all_transactions',
  New = 'new',
  InProgress = 'in_progress',
  Finished = 'finished'
}
