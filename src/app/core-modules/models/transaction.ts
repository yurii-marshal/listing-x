import { OfferSummary } from './offer';

export interface Transaction {
  id: number;
  offer: OfferSummary;
  status: TransactionStatus;
  lastLogs: Log[];
  createdAt: string;
  urlDocument: string
  allowDelete: boolean;
  allowEdit: boolean;
  allowSign: boolean;
  allowDeny: boolean;
  allowInvite: boolean;
}

export enum TransactionStatus {
  All = 'All transactions',
  Started = 'Started',
  InReview = 'Delivered',
  Denied = 'Denied',
  Accepted = 'Accepted',
  Completed = 'Completed'
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
