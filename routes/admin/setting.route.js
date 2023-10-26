const express = require('express');
const multer = require('multer')
const fileUpload = multer();
const controller = require('../../controller/admin/setting.controller');
const uploadClound = require('../../middlewares/admin/uploadClound.middleware');
const route = express.Router();


route.get('/general', controller.general);

route.patch('/general', fileUpload.single('logo'), uploadClound.uploadClound, controller.generalPATCH);

module.exports = route;