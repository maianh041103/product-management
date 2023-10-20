const md5 = require('md5');
const User = require('../../models/user.model');
const ForgotPassword = require('../../models/forgot-password.model');
const generateHelper = require('../../helpers/generate');

//[GET] /user/register
module.exports.register = async (req, res) => {
  res.render('client/pages/user/register.pug', {
    pageTitle: "Đăng ký tài khoản"
  })
}

//[POST] /user/register
module.exports.registerPOST = async (req, res) => {
  req.body.password = md5(req.body.password);
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    req.flash("error", "Email đã tồn tại");
    res.redirect("back");
    return;
  }
  const user = new User(req.body);
  await user.save();
  res.cookie('tokenUser', user.tokenUser);
  res.redirect('/')
}

//[GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập"
  })
}

//[POST] /user/login
module.exports.loginPOST = async (req, res) => {

  const emailExist = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if (!emailExist) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }
  if (md5(req.body.password) !== emailExist.password) {
    req.flash("error", "Mật khẩu không chính xác");
    res.redirect("back");
    return;
  }
  if (emailExist.status !== "active") {
    req.flash("error", "Tài khoản đang bị khóa");
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", emailExist.tokenUser);

  res.redirect('/');
}

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/user/login");
}

//[GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render('client/pages/user/forgot-password.pug', {
    pageTitle: "Lấy lại mật khẩu"
  });
}

//[POST] /user/password/forgot
module.exports.forgotPasswordPOST = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  req.body.expireAt = new Date();
  req.body.otp = generateHelper.generateRandomNumber(8);
  const forgotPassword = new ForgotPassword(req.body);
  await forgotPassword.save();

  //Gửi mail
  res.send("OK");
}