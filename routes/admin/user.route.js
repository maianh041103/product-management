const express = require('express');
const route = express.Router();
const controller = require('../../controller/admin/user.controller');
const multer = require('multer');
const fileUpload = multer();
const uploadClound = require('../../middlewares/admin/uploadClound.middleware');

route.get("/", controller.index);

route.get('/detail/:id', controller.detail);

route.get('/edit/:id', controller.edit);

route.patch('/edit/:id', fileUpload.single('avatar'), uploadClound.uploadClound, controller.editPATCH);

route.patch('/change-status/:status/:id', controller.changeStatus);

route.delete('/delete/:id', controller.delete);

module.exports = route;