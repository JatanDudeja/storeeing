export class APIResponse {
  private statusCode: number;
  private message: string;
  private data?: string | object;

  constructor(statusCode: number, message: string, data?: string | object) {
    this.statusCode = statusCode;
    this.message = message;
    if (data) this.data = data;
  }
}
