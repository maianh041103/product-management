const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/myAccount.controller');
const multer = require('multer');
const uploadFileImage = require('../../middlewares/admin/uploadClound.middleware');
const validate = require('../../validates/admin/account.validate');
const upload = multer();

route.get('/', controller.index);

route.get('/edit', controller.edit);

route.patch('/edit', upload.single("avatar"), uploadFileImage.uploadClound, validate.editPATCH, controller.editPATCH);

module.exports = route;