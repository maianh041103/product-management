const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/user.controller');
const userValidate = require('../../validates/client/user.validate');

route.get('/register', controller.register);

route.post('/register', userValidate.createPOST, controller.registerPOST);

route.get('/login', controller.login);

route.post('/login', userValidate.loginPOST, controller.loginPOST);

route.get('/logout', controller.logout);

module.exports = route;