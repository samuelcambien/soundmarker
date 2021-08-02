export class User {

  constructor(
    public email?: string,
    private expiryDate?: string,
    public token?: string,
  ) {
  }

  name;

  isValid(): boolean {
    return true;
  }
}
