const routesCards = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLike,
} = require('../controllers/cards');

routesCards.post('/', createCard);
routesCards.get('/', getCards);
routesCards.delete('/:cardId', deleteCard);
routesCards.put('/:cardId/likes', likeCard);
routesCards.delete('/:cardId/likes', deleteLike);

module.exports = routesCards;
