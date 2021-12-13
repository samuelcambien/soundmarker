export class User {

  constructor(
    public email?: string,
    public name?: string,
    private expiryDate?: string,
    public token?: string,
  ) {
  }

  isValid(): boolean {
    return true;
  }
}
