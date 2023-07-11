class ErrorConflict extends Error {
  constructor(message = 'Конфликт.') {
    super(message);
    this.message = (`409 Conflict — ${message}`);
    this.statusCode = 409;
  }
}

module.exports = ErrorConflict;
