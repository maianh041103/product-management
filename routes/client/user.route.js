const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/user.controller');
const userValidate = require('../../validates/client/user.validate');
const authMiddlerware = require('../../middlewares/client/auth.middlerware');
const multer = require('multer')
const fileUpload = multer();
const uploadClound = require('../../middlewares/admin/uploadClound.middleware');

route.get('/register', controller.register);

route.post('/register', userValidate.createPOST, controller.registerPOST);

route.get('/login', controller.login);

route.post('/login', userValidate.loginPOST, controller.loginPOST);

route.get('/logout', controller.logout);

route.get('/password/forgot', controller.forgotPassword);

route.post('/password/forgot', userValidate.forgotPassword, controller.forgotPasswordPOST);

route.get('/password/otp', controller.otpPassword);

route.post('/password/otp', userValidate.forgotPassword, controller.otpPasswordPOST);

route.get('/password/reset', controller.resetPassword);

route.post('/password/reset', userValidate.resetPasswordPost, controller.resetPasswordPost);

route.get('/info', authMiddlerware.requireAuth, controller.info);

route.get('/info/edit', authMiddlerware.requireAuth, controller.infoEdit);

route.patch('/info/edit', fileUpload.single('avatar'), uploadClound.uploadClound, controller.infoEditPATCH);

route.get('/info/change-password', controller.changePassword);

route.patch('/info/change-password', controller.changePasswordPATCH);

module.exports = route;