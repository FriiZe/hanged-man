export class GameNotFoundError extends Error {
  public constructor() {
    super('the requested game was not found');
  }
}
