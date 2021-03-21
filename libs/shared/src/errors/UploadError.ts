export class UploadError extends Error {
  constructor(message: string, readonly invalidFiles: File[]) {
    super(message);
  }
}
