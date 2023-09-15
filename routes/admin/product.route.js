const express = require('express');
const multer = require('multer')
const storageMulter = require('../../helpers/storageMulter');
const upload = multer({ storage: storageMulter() })
const controller = require('../../controller/admin/product.controller');

const route = express.Router();

route.get('/', controller.index);

route.patch('/change-status/:status/:id', controller.changeStatus);

route.patch('/change-multi', controller.changeMulti);

route.delete('/delete/:id', controller.deleteItem);

route.get('/create', controller.ceate);

route.post('/create', upload.single('thumbnail'), controller.ceatePOST);

module.exports = route