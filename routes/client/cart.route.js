const express = require('express');
const route = express.Router();

const controller = require('../../controller/client/cart.controller');

route.get('/', controller.index);

route.post('/add/:id', controller.addPOST);

module.exports = route;