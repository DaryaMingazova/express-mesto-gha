const routesCards = require('express').Router();

const {
  validateCardPost,
  validateCardId,
} = require('../middlewares/validation');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLike,
} = require('../controllers/cards');

routesCards.post('/', validateCardPost, createCard);
routesCards.get('/', getCards);
routesCards.delete('/:cardId', validateCardId, deleteCard);
routesCards.put('/:cardId/likes', validateCardId, likeCard);
routesCards.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = routesCards;
