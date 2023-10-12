const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/article-category.controller');
const multer = require('multer')
const fileUpload = multer();
const validateCategory = require('../../validates/admin/product-category.validate.js');
const uploadClound = require('../../middlewares/admin/uploadClound.middleware');

route.get('/', controller.index);

route.get('/create', controller.create);

route.post('/create', fileUpload.single('thumbnail'), uploadClound.uploadClound, validateCategory.createPost, controller.createPOST);

route.patch('/change-status/:status/:id', controller.changeStatus);

route.get('/edit/:id', controller.edit);

route.patch('/edit/:id', fileUpload.single('thumbnail'), uploadClound.uploadClound, validateCategory.createPost, controller.editPATCH);

route.get('/detail/:id', controller.detail)

route.delete('/delete/:id', controller.deleteItem);

route.patch('/change-multi', controller.changeMulti);
module.exports = route;