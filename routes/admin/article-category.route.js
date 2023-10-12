const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/article-category');

route.get('/', controller.index);

module.exports = route;