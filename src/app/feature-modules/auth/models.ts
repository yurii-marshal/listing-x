
export class User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

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
