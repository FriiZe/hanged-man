export class DisplayNameAlreadyTakenError extends Error {
  public constructor() {
    super('this display name is already taken');
  }
}
