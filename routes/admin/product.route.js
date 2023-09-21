const express = require('express');
const multer = require('multer')
const fileUpload = multer();
const controller = require('../../controller/admin/product.controller');
const validate = require('../../validates/admin/products.validate.js');
const uploadClound = require('../../middlewares/admin/uploadClound.middleware');
const route = express.Router();

route.get('/', controller.index);

route.patch('/change-status/:status/:id', controller.changeStatus);

route.patch('/change-multi', controller.changeMulti);

route.delete('/delete/:id', controller.deleteItem);

route.get('/create', controller.ceate);

route.post('/create', fileUpload.single('thumbnail'), uploadClound.uploadClound, validate.createPost, controller.ceatePOST);

route.get('/edit/:id', controller.edit);

route.patch('/edit/:id', fileUpload.single('thumbnail'), uploadClound.uploadClound, validate.createPost, controller.editPATCH);

route.get('/detail/:id', controller.detail);

module.exports = route