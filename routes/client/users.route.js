const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/users.controller');

route.get('/not-friend', controller.notFriend);

route.get('/request', controller.requestFriend);

route.get('/accept', controller.acceptFriend);

route.get('/friends', controller.friends);

module.exports = route;