export class Address {
  id: number;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  generatedLink: string;

  // internal transient property
  date: Date;
  name: string;
  address: string;
  offersCreated: number;
  offersSigned: number;


  constructor(data?: any) {
    if (data) {
      this.id = +data.id;
      this.firstName = data.first_name || '';
      this.lastName = data.last_name || '';
      this.street = data.street_name || '';
      this.city = data.city;
      this.state = data.state;
      this.zip = data.zip;
      this.generatedLink = data.generated_link;

      this.date = new Date(data.created_at);
      this.name = `${this.firstName} ${this.lastName}`;
      this.address = `${this.street}, ${this.city} ${this.state}, ${this.zip}`;
      this.offersCreated = +data.offers_created;
      this.offersSigned = +data.offers_signed;
    }
  }
  
  serialize() {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      street_name: this.street,
      city: this.city,
      state: this.state,
      zip: this.zip,
      generated_link: this.generatedLink
      
    }
  }
}
