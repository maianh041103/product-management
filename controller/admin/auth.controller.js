const Account = require('../../models/account.model');
const md5 = require('md5');
const systemConfig = require('../../config/system');

//[GET] admin/auth/login
module.exports.login = async (req, res) => {
  if (req.cookies.token) {
    const user = await Account.findOne({
      token: req.cookies.token,
      deleted: false,
      status: "active"
    })
    if (user) {
      res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
      return;
    }
  }
  res.render('admin/pages/auth/login', {
    pageTitle: "Đăng nhập"
  })
}

//[POST] admin/auth/login
module.exports.loginPOST = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    deleted: false,
    email: email
  });
  if (!user) {
    req.flash("error", "Email không hợp lệ");
    res.redirect('back');
    return;
  }
  if (user.password != md5(password)) {
    req.flash("error", "Mật khẩu không chính xác");
    res.redirect('back');
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa");
    res.redirect('back');
    return;
  }
  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  return;

}

//[GET] admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}