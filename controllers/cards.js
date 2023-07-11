const ErrorBadRequest = require('../utils/errors/bad-request');
const ErrorNotFound = require('../utils/errors/not-found');
const ErrorForbidden = require('../utils/errors/forbidden');

const Card = require('../models/card');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.payload;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные для создания карточки.'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new ErrorNotFound('Карточка не найдена.'))
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user.payload)) {
        return next(new ErrorForbidden('Нельзя удалять чужие карточки.'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена.' }));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new ErrorNotFound('Карточка не найдена.'))
    .then((card) => res.send(card))
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new ErrorNotFound('Карточка не найдена.'))
    .then((card) => res.status(200).send(card))
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLike,
};
