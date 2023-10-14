const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/article.controller');
const multer = require('multer')
const fileUpload = multer();
const validateCategory = require('../../validates/admin/product-category.validate.js');
const uploadClound = require('../../middlewares/admin/uploadClound.middleware');

route.get('/', controller.index);

route.get('/create', controller.create);

route.post('/create', fileUpload.single('thumbnail'), uploadClound.uploadClound, validateCategory.createPost, controller.createPOST);

route.patch('/change-status/:status/:id', controller.changeStatus);
module.exports = route;