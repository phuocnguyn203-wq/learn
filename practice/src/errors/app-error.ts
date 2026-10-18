export class AppError extends Error {
  statusCode: number;
  code: string;
  name: string;
  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(404, "NOT_FOUND", message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(409, "CONFLICT", message);
  }
}

export type Details = {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  details: Details[]
  constructor(details: Details[], message="validation error") {
    super(400, "VALIDATION_ERROR", message);
    this.details = details;
  }
}
