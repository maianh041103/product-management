const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/role.controller');

route.get('/', controller.index);

route.get('/create', controller.create);

route.post('/create', controller.createPOST);

route.get('/detail/:id', controller.detail);

route.get('/edit/:id', controller.edit);

route.patch('/edit/:id', controller.editPATCH);

route.delete('/delete/:id', controller.delete);

module.exports = route;