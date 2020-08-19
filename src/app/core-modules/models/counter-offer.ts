import { Offer, Person } from './offer';

export interface CounterOffer extends Offer {
  round: number;
  offerType: 'counter_offer' | 'multiple_counter_offer' | 'buyer_counter_offer';
  catcher: number;
  pitcher: number;
  catchers: Person[];
  pitchers: Person[];
  catcher_customers: Person[];
  pitcher_customers: Person[];
}
