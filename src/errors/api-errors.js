class ValidationError extends Error {
  constructor(message, errorDetails) {
    super(message);
    this.name = "ValidationError";
    this.errorDetails = errorDetails;
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
  }
}

module.exports = { ValidationError, AuthorizationError };
