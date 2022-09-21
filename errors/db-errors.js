class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class DuplicateEntityError extends Error {
  constructor(message) {
    super(message);
    this.name = "DuplicateEntityError";
  }
}

class UnverifiedUserError extends Error {
  constructor(message, errorDetails) {
    super(message);
    this.name = "UnverifiedUserError";
    this.errorDetails = errorDetails;
  }
}

module.exports = {
  AuthenticationError,
  DuplicateEntityError,
  UnverifiedUserError
};
