const routesUsers = require('express').Router();

const {
  validateUserId,
  validateUserUpdate,
  validateUserAvatar,
} = require('../middlewares/validation');

const {
  getUsers,
  getUser,
  getCurrentUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routesUsers.get('/', getUsers);
routesUsers.get('/me', getCurrentUserInfo);
routesUsers.get('/:id', validateUserId, getUser);
routesUsers.patch('/me', validateUserUpdate, updateUser);
routesUsers.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = routesUsers;
