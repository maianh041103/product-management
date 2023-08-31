const express = require('express');
const controller = require('../../controller/admin/product.controller');

const route = express.Router();

route.get('/', controller.index);

module.exports = route