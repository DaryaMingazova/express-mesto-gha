class ErrorNotFound extends Error {
  constructor(message = 'Не найдено.') {
    super(message);
    this.message = (`404 Not Found — ${message}`);
    this.statusCode = 404;
  }
}

module.exports = ErrorNotFound;
