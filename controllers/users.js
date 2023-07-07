const bcrypt = require('bcrypt');

const {
  DEFAULT_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  NOTFOUND_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
} = require('../utils/errors');

const User = require('../models/user');

const SALT_ROUNDS = 10;

const createUser = (req, res) => {
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
          if (err.name === 'ValidationError') {
            res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные при создании пользователя.' });
            return;
          }
          res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
        });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(403).send({ message: 'Не переданы email или пароль.' });
    return;
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        res.status(403).send({ message: 'Такого пользователя не существует.' });
        return;
      }
      bcrypt.compare(password, user.password, (error, isCorrectPassword) => {
        if (!isCorrectPassword) {
          return res.status(401).send({ message: 'Пароль неверный.' });
        }
        res.status(200).send(user);
      });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE }));
    return;
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: '404 — Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные _id.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const updateUser = (req, res) => {
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
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const updateAvatar = (req, res) => {
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
        res.status(NOTFOUND_ERROR_CODE).send({ message: '404 — Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные при обновлении аватара.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
};
