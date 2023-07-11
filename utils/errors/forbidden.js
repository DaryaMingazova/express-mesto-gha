class ErrorForbidden extends Error {
  constructor(message = 'Запрещено.') {
    super(message);
    this.message = (`403 Forbidden — ${message}`);
    this.statusCode = 403;
  }
}

module.exports = ErrorForbidden;
