const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/role.controller');

route.get('/', controller.index);

module.exports = route;