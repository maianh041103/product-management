const md5 = require('md5');
const User = require('../../models/user.model');
const ForgotPassword = require('../../models/forgot-password.model');
const generateHelper = require('../../helpers/generate');
const sendEmailHelper = require('../../helpers/sendEmail');
const Cart = require('../../models/cart.model');

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

  const cart = await Cart.findOne({
    user_id: emailExist._id
  });

  if (cart) {
    res.cookie("cartId", cart.id);
  } else {
    await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: emailExist.id });
  }

  res.redirect('/');
}

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
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
  const subject = "Mã OTP đổi mật khẩu";
  const html = `
      Mã OTP : <b style="color:green">${req.body.otp}</b>
  `
  sendEmailHelper.sendEmail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
}

//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password.pug", {
    pageTitle: "Gửi mã OTP",
    email: email
  })
}

//[POST] /user/password/otp
module.exports.otpPasswordPOST = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!result) {
    req.flash("error", "Mã OTP sai");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect('/user/password/reset');
}

//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: " Thay đổi mật khẩu"
  })
}

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  try {
    await User.updateOne({
      tokenUser: req.cookies.tokenUser
    }, {
      password: md5(password)
    })
    res.redirect('/');
  } catch (error) {
    req.flash("Đổi mật khẩu thất bại");
    res.redirect("back");
  }
}

//[GET] /user/info
module.exports.info = async (req, res) => {
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser
  })
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin chi tiết"
  })
}

//[GET] user/info/edit
module.exports.infoEdit = async (req, res) => {
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser
  })
  res.render("client/pages/user/info-edit", {
    pageTitle: "Sửa thông tin cá nhân",
    user: user
  })
}

//[PATCH] /user/info/edit
module.exports.infoEditPATCH = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    const emailExist = await User.findOne({
      _id: { $ne: user._id },
      email: email
    });
    if (emailExist) {
      req.flash("error", "Email đã tồn tại");
      res.redirect("back");
      return;
    }
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await User.updateOne({ tokenUser: req.cookies.tokenUser }, req.body)
    req.flash("success", "Cập nhật thông tin tài khoản thành công");
  } catch (error) {
    req.flash("error", "Cập nhật thông tin tài khỏan thất bại");
  }
  res.redirect("back");
}
