import { LoanType } from '../enums/loan-type';
import { Document } from './document';

export interface OfferSummary extends Offer {
  documents: LinkedDocuments;
  remainingDaysCloseEscrow: number;
}

export interface Offer {
  id: number;
  buyers: Person[];
  sellers: Person[];
  streetName: string;
  city: string;
  state: string;
  apn: string;
  zip: number;
  price: number;
  closeEscrowDays: number;

  loans?: Loan[];
  loanType?: LoanType;  // CONVENTIONAL LOAN,
  downPayment?: number;
  anySpecialFinancialTerms?: string;
}

export interface Person {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
}

export class Loan {
  initialDeposit: string;
  loanAmount: string;
  interestRate: number;
  points: number;
}

export interface LinkedDocuments {
  coverLetter: Document[];
  preApproval: Document[];
  proofOfFunds: Document[];
}
