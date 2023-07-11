const jwt = require('jsonwebtoken');

const ErrorUnauthorized = require('../utils/errors/unauthorized');

const JWT_SECRET = 'most_secret_word_ever';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new ErrorUnauthorized('Необходима авторизация.');
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new ErrorUnauthorized('Неправильный токен. Необходима авторизация.');
  }

  req.user = payload;

  next();
};
