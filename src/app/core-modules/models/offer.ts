import { LoanType } from '../enums/loan-type';
import { Document } from './document';

export interface OfferSummary extends Offer {
  documents: LinkedDocuments;
  remainingDaysCloseEscrow: number;
  transaction: number;
  loan?: number;
  deposit?: number;
  interestRate?: number;
  points?: number;
  closeOfEscrow?: number;
}

export interface Offer {
  // First step
  id: number;
  buyers: Person[];
  sellers: Person[];
  agentBuyers: Person[];
  agentSellers: Person[];
  customers: Person[];
  streetName: string;
  city: string;
  state: string;
  apn: string;
  zip: number;
  price: number;
  closeEscrowDays: number;

  // additional
  createdAt?: Date | string;
  progress?: number;
  status?: string;
  transaction?: number;

  // Second step
  initialDeposit?: string;
  loans?: Loan[];
  loanType?: LoanType;  // CONVENTIONAL LOAN,
  downPayment?: number;
  anySpecialFinancialTerms?: string;
  remainingDaysCloseEscrow?: number;
  userRole?: 'buyer' | 'seller' | 'agent_buyer' | 'agent_seller';

  // Third step
  documents: LinkedDocuments;
}

export interface Person {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  signed?: boolean;
  companyLicense: string;
  companyName: string;
  licenseCode: number;
  phoneNumber: number;
}

export class Loan {
  loanAmount: string;
  interestRate: number;
  points: number;
}

export interface LinkedDocuments {
  coverLetter: Document[];
  preApproval: Document[];
  proofOfFunds: Document[];
}
