class EntityNotFoundError extends Error {
  public constructor() {
    super('The requested entity was not found');
  }
}

export default EntityNotFoundError;
