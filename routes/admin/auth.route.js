const express = require('express');
const controller = require('../../controller/admin/auth.controller');
const validate = require('../../validates/admin/auth.validate');
const route = express.Router();

route.get('/login', controller.login);

route.post('/login', validate.auth, controller.loginPOST);

route.get('/logout', controller.logout);

module.exports = route;