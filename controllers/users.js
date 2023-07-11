const bcrypt = require('bcrypt');

const ErrorBadRequest = require('../utils/errors/bad-request'); // 400
const ErrorUnauthorized = require('../utils/errors/unauthorized'); // 401
const ErrorNotFound = require('../utils/errors/not-found'); // 404
const ErrorConflict = require('../utils/errors/conflict'); // 409

const User = require('../models/user');
const getJwtToken = require('../utils/jwt');

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => {
          res.status(201).send(user);
        })
        .catch((err) => {
          if (err.name === 'MongoServerError' || err.code === 11000) {
            next(new ErrorConflict('Пользователь с такой почтой уже зарегистрирован.'));
          } else if (err.name === 'ValidationError') {
            next(new ErrorBadRequest('Переданы неккоректные данные для создания пользователя.'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      const token = getJwtToken(user._id);
      res
        .cookie('jwt', token, {
          maxage: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Успешная авторизация.' });
    })
    .catch(() => {
      next(new ErrorUnauthorized('Неправильные почта или пароль.'));
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 1) {
        throw new ErrorNotFound('Пользователи не найдены.');
      }
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь не найден.'));
      } else res.send(user);
    })
    .catch(next);
};

const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user.payload)
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Передан некорректный id пользователя.'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь не найден.'));
      } else res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorBadRequest('Передан некорректный id пользователя.'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUser,
  getCurrentUserInfo,
  updateUser,
  updateAvatar,
};
