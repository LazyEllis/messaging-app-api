export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}
