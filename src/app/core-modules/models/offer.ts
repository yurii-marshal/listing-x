import { LoanType } from '../enums/loan-type';

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

  loans?: Loan[],
  loanType?: LoanType;  // CONVENTIONAL LOAN,
  downPayment?: string,
  anySpecialFinancialTerms?: string
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
