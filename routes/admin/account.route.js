const express = require('express');
const controller = require('../../controller/admin/account.controller');
const multer = require('multer');
const uploadFileImage = require('../../middlewares/admin/uploadClound.middleware');
const validate = require('../../validates/admin/account.validate');
const route = express.Router();
const upload = multer();

route.get('/', controller.index);

route.get('/create', uploadFileImage.uploadClound, controller.create);

route.post('/create', upload.single("avatar"), uploadFileImage.uploadClound, validate.createPOST, controller.createPOST);

module.exports = route;