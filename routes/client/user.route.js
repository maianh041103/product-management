const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/register.controller');
const userValidate = require('../../validates/client/user.validate');

route.get('/register', controller.register);

route.post('/register', userValidate.createPOST, controller.registerPOST);

module.exports = route;