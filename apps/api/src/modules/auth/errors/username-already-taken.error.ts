export class UsernameAlreadyTakenError extends Error {
  public constructor() {
    super('this username is already taken');
  }
}
