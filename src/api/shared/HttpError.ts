class HttpError extends Error {
  message: string;
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.message = message;
    this.status = status;
  }

  toString() {
    return `[${this.status}]: ${this.message}`;
  }
}

export default HttpError;
