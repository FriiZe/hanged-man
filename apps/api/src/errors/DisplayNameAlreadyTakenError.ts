class DisplayNameAlreadyTakenError extends Error {
  public constructor() {
    super('This display name is already taken');
  }
}

export default DisplayNameAlreadyTakenError;
