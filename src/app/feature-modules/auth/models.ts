
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  account_type: string;
  registration_finished: boolean;

  company_name: string;
  license_number: string;
  broker_number: string;
  address: string;
  phone_number: string;
}
