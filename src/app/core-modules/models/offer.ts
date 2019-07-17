import * as _ from 'lodash';

export interface Offer {
  id: number;
  buyers: Person[];
  sellers: Person[];
  streetName: string;
  city: string;
  state: string; //  'California'
  apn: string;
  zip: number;
  price: number;
  closeEscrowDays: number;

/*
  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.buyers = this.parseBuyers(data.buyers);
      this.sellers = _.map(data.sellers, item => new Person(item));
      this.streetName = data.street_name;
      this.city = data.city;
      this.state = data.state;
      this.apn = data.apn;
      this.zip = data.zip;
      this.price = data.price;
      this.closeEscrowDays = data.close_escrow_days;
    } else {
      this.buyers = [new Person];
      this.sellers = [];
    }
  }

  serialize(): any {
    return {
      id: this.id,
      buyers: _.map(this.buyers, item => item.serialize()),
      sellers: _.map(this.sellers, item => item.serialize()),
      street_name: this.streetName,
      city: this.city,
      state: this.state,
      apn: this.apn,
      zip: this.zip,
      price: this.price,
      close_escrow_days: this.closeEscrowDays
    }
  }

  private parseBuyers(buyers: any[]): Person[] {
    if (_.isEmpty(buyers)) {
      return [new Person()]; // predefined one section with buyer
    }

    return _.map(buyers, item => new Person(item))
  }
*/
}
  
export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    email: string;

/*  constructor(data?: any) {
    if (data) {
      this.id = +data.id;
      this.firstName = data.first_name;
      this.lastName = data.last_name;
      this.email = data.email;
    }
  }

  serialize(): any {
      return {
        id: this.id,
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email
      };
    }*/
}
