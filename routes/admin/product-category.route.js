const express = require('express');
const multer = require('multer')
const fileUpload = multer();
const controller = require('../../controller/admin/product-category.controller');
const validateCategory = require('../../validates/admin/product-category.validate.js');
const uploadClound = require('../../middlewares/admin/uploadClound.middleware');
const route = express.Router();

route.get('/', controller.index);

route.get('/create', controller.create);

route.post('/create', fileUpload.single('thumbnail'), uploadClound.uploadClound, validateCategory.createPost, controller.createPOST);

module.exports = route