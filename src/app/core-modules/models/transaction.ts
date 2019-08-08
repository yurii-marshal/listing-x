import { OfferSummary } from './offer';

export interface Transaction {
  id: number;
  offer: OfferSummary;
  status: TransactionStatus;
  lastLogs: Log[];
  allowDelete: boolean;
  allowEdit: boolean;
  createdAt: string;
}

export enum TransactionStatus {
  All = 'All transactions',
  Started = 'Started',
  InReview = 'In review',
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