const express = require('express');
const controller = require('../../controller/admin/product.controller');

const route = express.Router();

route.get('/', controller.index);

route.patch('/change-status/:status/:id', controller.changeStatus);

route.patch('/change-multi', controller.changeMulti);

route.delete('/delete/:id', controller.deleteItem);

route.get('/create', controller.ceate);

route.post('/create', controller.ceatePOST);

module.exports = route