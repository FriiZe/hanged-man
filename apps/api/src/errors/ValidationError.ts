class ValidationError extends Error {
  public messages: string[];

  public constructor(messages: string[]) {
    super('Error while validating the request');
    this.messages = messages;
  }
}

export default ValidationError;
