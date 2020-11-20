export class UniqueDisplayNameUserError extends Error {
  public constructor() {
    super('there can only be one player linked to an user');
  }
}
