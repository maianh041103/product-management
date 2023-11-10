const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/room-chat.controller');
const multer = require('multer')
const fileUpload = multer();
const uploadClound = require('../../middlewares/admin/uploadClound.middleware');

route.get('/', controller.index);

route.get('/create', controller.create);

route.post('/create', fileUpload.single('avatar'), uploadClound.uploadClound, controller.createPOST);

module.exports = route;