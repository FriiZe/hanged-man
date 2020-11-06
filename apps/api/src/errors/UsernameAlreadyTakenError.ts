class UsernameAlreadyTakenError extends Error {
  public constructor() {
    super('This username is already taken');
  }
}

export default UsernameAlreadyTakenError;
