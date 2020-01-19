export class User {

  constructor(
    private expiryDate?: Date,
    public token?: string,
    public email?: string,
  ) {
  }

  name;

  isValid(): boolean {
    return this.expiryDate && new Date() < this.expiryDate;
  }
}
