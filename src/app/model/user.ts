export class User {

  constructor(
    private expiryDate?: string,
    public token?: string,
    public email?: string,
  ) {
  }

  name;

  isValid(): boolean {
    return true;
  }
}
