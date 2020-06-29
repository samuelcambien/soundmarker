export class User {

  constructor(
    private expiryDate?: string,
    public token?: string,
    public email?: string,
  ) {
  }

  name;

  isValid(): boolean {
    return new Date().getTime() < Date.parse(this.expiryDate);
  }
}
