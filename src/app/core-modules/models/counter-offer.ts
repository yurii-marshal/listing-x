import { Offer, Person } from './offer';
import { CounterOfferType } from './counter-offer-type';

export interface CounterOffer extends Offer {
  round: number;
  offerType: CounterOfferType;
  catcher: number;
  pitcher: number;
  catchers: Person[];
  pitchers: Person[];
  catcherCustomers: Person[];
  pitcherCustomers: Person[];

  canFinalSign: boolean;
  needFinalApprove: boolean;

  canEdit?: boolean;
}
