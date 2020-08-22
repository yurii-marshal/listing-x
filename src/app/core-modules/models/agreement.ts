import { OfferSummary } from './offer';
import { GeneratedDocument } from './document';
import { Log } from './log';

export interface Agreement {
  id: number;
  createdAt: string;
  status: AgreementStatus;
  lastLogs: Log[];
  offer: OfferSummary;
  documents: GeneratedDocument[];
  allowEdit: boolean;
  allowDelete: boolean;
  allowDeny: boolean;
  allowInvite: boolean;
  /** @deprecated **/
  urlDocument: string;
  allowSign: boolean;
}

export enum AgreementStatus {
  All = 'all_agreements',
  Started = 'started',
  Delivered = 'delivered',
  Denied = 'denied',
  Countered = 'countered',
  Accepted = 'accepted',
  Completed = 'completed',
}
