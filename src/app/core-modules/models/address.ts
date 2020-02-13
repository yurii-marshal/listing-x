export interface Address {
  id: number;
  firstName: string;
  lastName: string;
  sellers: any[]; // TODO: check model
  streetName: string;
  city: string;
  state: string;
  zip: string;
  apn: string;
  generatedLink: string;
}
