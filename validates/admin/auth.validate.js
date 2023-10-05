module.exports.auth = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu");
    return;
  }
  next();
}