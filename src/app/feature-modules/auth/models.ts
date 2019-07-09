
export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;


  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
      this.password = data.password;
    }
  }

  serializeLogin(): any {
    return {
      email: this.email,
      password: this.password
    };
  }

  serialize(): any {
    return {
      email: this.email,
      password: this.password
    };
  }
}
