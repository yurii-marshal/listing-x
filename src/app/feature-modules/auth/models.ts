
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: string;
  registrationCompleted: boolean;

  companyName: string;
  licenseNumber: number;
  brokerNumber: number;
  address: string;
  phoneNumber: string;
}
