const express = require('express');
const multer = require('multer')
const storageMulter = require('../../helpers/storageMulter');
const upload = multer({ storage: storageMulter() })
const controller = require('../../controller/admin/product.controller');
const validate = require('../../validates/admin/products.validate.js');

const route = express.Router();

route.get('/', controller.index);

route.patch('/change-status/:status/:id', controller.changeStatus);

route.patch('/change-multi', controller.changeMulti);

route.delete('/delete/:id', controller.deleteItem);

route.get('/create', controller.ceate);

route.post('/create', upload.single('thumbnail'), validate.createPost, controller.ceatePOST);

route.get('/edit/:id', controller.edit);

route.patch('/edit/:id', upload.single('thumbnail'), validate.createPost, controller.editPATCH);

route.get('/detail/:id', controller.detail);

module.exports = route