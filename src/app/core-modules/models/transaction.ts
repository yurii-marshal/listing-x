import { OfferSummary } from './offer';

export interface Transaction {
  id: number;
  offer: OfferSummary;
  status: TransactionStatus;
  lastEvents: TransactionEvent[];
}

export enum TransactionStatus {
  All = 'All transactions',
  Started = 'Started',
  InReview = 'In review',
  Denied = 'Denied',
  Accepted = 'Accepted',
  Completed = 'Completed'
}

export interface TransactionEvent {
  "date": Date;
  "event": string;
}
