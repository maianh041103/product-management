const md5 = require('md5');
const User = require('../../models/user.model');

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