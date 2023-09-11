const express = require('express');
const controller = require('../../controller/admin/product.controller');

const route = express.Router();

route.get('/', controller.index);

route.patch('/change-status/:status/:id', controller.changeStatus);

route.patch('/change-multi', controller.changeMulti);

module.exports = route