export class BadCredentialsError extends Error {
  public constructor() {
    super('the username / password combination is wrong');
  }
}
