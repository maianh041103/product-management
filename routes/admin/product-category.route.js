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

route.patch('/change-status/:status/:id', controller.changeStatus);

route.patch('/change-multi', controller.changeMulti);

route.delete('/delete/:id', controller.deleteItem);

route.get('/edit/:id', controller.edit);

route.patch('/edit/:id', fileUpload.single('thumbnail'), uploadClound.uploadClound, validateCategory.createPost, controller.editPATCH);

route.get('/detail/:id', controller.detail);
module.exports = route