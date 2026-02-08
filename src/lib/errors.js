export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

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

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}
