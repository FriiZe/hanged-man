interface StatuslessError {
  message: string,
  description: string,
  data: Array<unknown>,
}

class CustomError extends Error {
  public readonly message: string;

  public readonly description: string;

  public readonly data: Array<unknown>;

  private status: number;

  constructor(message: string, status = 500, description = '') {
    super(message);

    this.message = message;
    this.status = status;
    this.description = description;
    this.data = new Array<unknown>();
  }

  public get getStatus(): number {
    return this.status;
  }

  public addData(data: unknown): void {
    this.data.push(data);
  }

  public toJSON(): StatuslessError {
    return {
      message: this.message,
      description: this.description,
      data: this.data,
    };
  }
}

export default CustomError;
