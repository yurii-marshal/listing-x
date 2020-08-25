import { OfferSummary } from './offer';
import { GeneratedDocument } from './document';
import { Log } from './log';
import { PurchaseAgreement } from 'src/app/core-modules/models/purchase-agreement';

export interface Transaction {
  id: number;
  createdAt: string;
  status: TransactionStatus;
  lastLogs: Log[];
  offer: OfferSummary;
  documents: GeneratedDocument[];
  purchaseAgreements: PurchaseAgreement;
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
