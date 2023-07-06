const routesUsers = require('express').Router();
const {
  createUser,
  login,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routesUsers.post('/signup', createUser);
routesUsers.post('/signin', login);
routesUsers.get('/users', getUsers);
routesUsers.get('/users/:id', getUser);
routesUsers.patch('/users/me', updateUser);
routesUsers.patch('/me/users/avatar', updateAvatar);
module.exports = routesUsers;
