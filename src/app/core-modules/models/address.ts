import {Person} from './offer';

export interface Address {
  id: number;
  firstName: string;
  lastName: string;
  sellers: Person[];
  streetName: string;
  city: string;
  state: string;
  zip: string;
  apn: string;
  generatedLink: string;
}
