const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');
const { validateUserCreate, validateUserLogin } = require('./middlewares/validation');

const auth = require('./middlewares/auth');

const ErrorNotFound = require('./utils/errors/not-found');
const handleErrors = require('./middlewares/handleErrors');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const app = express();

app.use(cookieParser());

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { createUser, login } = require('./controllers/users');

app.post('/signup', validateUserCreate, createUser);
app.post('/signin', validateUserLogin, login);
app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход.' });
});

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use(errors());

app.use((req, res, next) => {
  next(new ErrorNotFound('Такой страницы не существует.'));
});

app.use(handleErrors);

app.listen(PORT);
