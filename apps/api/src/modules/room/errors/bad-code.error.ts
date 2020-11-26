class BadCodeError extends Error {
  public constructor() {
    super('the provided code is wrong');
  }
}

export default BadCodeError;
