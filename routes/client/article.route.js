const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/article.controller');

route.get("/", controller.index);

route.get("/:slugCategory", controller.category);

route.get("/detail/:slug", controller.detail);

module.exports = route;