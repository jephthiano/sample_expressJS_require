class ValidationError extends Error {
    constructor(errors) {
      super("Validation failed");
      this.name   = "ValidationError";
      this.errors = errors;      // array of { field, message }
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  
  class CustomApiException extends Error {
    constructor(message, status = 400, details = []) {
      super(message);
      this.name    = "CustomApiException";
      this.status  = status;
      this.details = details;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = {
    ValidationError,
    CustomApiException,
  };
  