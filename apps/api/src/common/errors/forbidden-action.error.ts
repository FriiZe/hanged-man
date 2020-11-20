export class ForbiddenActionError extends Error {
  public constructor() {
    super("you can't do that right now");
  }
}
