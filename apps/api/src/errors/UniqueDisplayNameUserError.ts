class UniqueDisplayNameUserError extends Error {
  public constructor() {
    super('There can only be one player linked to an user');
  }
}

export default UniqueDisplayNameUserError;
