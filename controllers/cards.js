const {
  DEFAULT_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  NOTFOUND_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
} = require('../utils/errors');

const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: '404 — Карточки не найдены.' });
        return;
      }
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: '404 — Передан несуществующий _id карточки.' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные _id для удаления карточки.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: '404 — Передан несуществующий _id карточки.' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные для постановки лайка.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOTFOUND_ERROR_CODE).send({ message: '404 — Передан несуществующий _id карточки.' });
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: '400 — Переданы некорректные данные для удаления лайка.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLike,
};
