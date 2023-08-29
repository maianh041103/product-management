//Express cung cap 1 ham route
const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/product.controller');

route.get('/', controller.index);

module.exports = route;