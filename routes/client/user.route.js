const express = require('express');
const route = express.Router();
const controller = require('../../controller/client/user.controller');
const userValidate = require('../../validates/client/user.validate');

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
module.exports = route;