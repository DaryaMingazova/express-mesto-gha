const express = require('express');
const mongoose = require('mongoose');

const {
  NOTFOUND_ERROR_CODE,
} = require('./utils/errors');

const routesCards = require('./routes/cards');
const routesUsers = require('./routes/users');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64a67468e9532de85ae32351',
  };
  next();
});

app.use('/', routesUsers);
app.use('/cards', routesCards);

app.use((req, res) => {
  res.status(NOTFOUND_ERROR_CODE).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
