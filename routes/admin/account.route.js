const express = require('express');
const controller = require('../../controller/admin/account.controller');
const multer = require('multer');
const uploadFileImage = require('../../middlewares/admin/uploadClound.middleware');
const validate = require('../../validates/admin/account.validate');
const route = express.Router();
const upload = multer();

route.get('/', controller.index);

route.get('/create', controller.create);

route.post('/create', upload.single("avatar"), uploadFileImage.uploadClound, validate.createPOST, controller.createPOST);

route.get('/edit/:id', controller.edit);

route.patch('/edit/:id', upload.single("avatar"), uploadFileImage.uploadClound, validate.editPATCH, controller.editPATCH);

route.get('/detail/:id', controller.detail);

route.delete('/delete/:id', controller.deleteItem);

route.patch('/change-status/:status/:id', controller.changeStatus);

module.exports = route;