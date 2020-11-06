class BadCredentialsError extends Error {
  public constructor() {
    super('The username / password combination is wrong');
  }
}

export default BadCredentialsError;
