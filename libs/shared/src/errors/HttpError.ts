export class HttpError extends Error {
  readonly name: string = 'HttpError';
  readonly statusCode: number = 500;
}
