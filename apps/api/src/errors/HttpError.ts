interface StatuslessError {
  message: string,
  errors: Array<string>,
}

class HttpError extends Error {
  public readonly errors: Array<string>;

  private readonly status: number;

  constructor(status = 500, message = 'Internal server error') {
    super(message);

    this.status = status;
    this.errors = [];
  }

  public get getStatus(): number {
    return this.status;
  }

  public addData(data: string): void {
    this.errors.push(data);
  }

  public toJSON(): StatuslessError {
    return {
      message: this.message,
      errors: this.errors,
    };
  }
}

export default HttpError;
