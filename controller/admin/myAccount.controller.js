const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');
const md5 = require('md5');

//[GET] /admin/my-account/
module.exports.index = async (req, res) => {
  const account = await Account.findOne({ _id: res.locals.accountUser.id, deleted: false });
  const role = await Role.findOne({ _id: account.role_id });
  if (role) {
    account.role = role.title;
  }
  res.render('admin/pages/my-account/index.pug', {
    pageTitle: "Thông tin cá nhân",
    account: account
  })
}

//[GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  const account = await Account.findOne({ _id: res.locals.accountUser.id, deleted: false });
  const role = await Role.findOne({ _id: account.role_id });
  if (role) {
    account.role = role.title;
  }
  res.render('admin/pages/my-account/edit.pug', {
    pageTitle: "Thông tin cá nhân",
    account: account
  })
}

//[PATCH] /admin/my-account/edit
module.exports.editPATCH = async (req, res) => {
  const id = res.locals.accountUser.id;
  const emailExist = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false
  })
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
  }
  else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thông tin tài khoản thành công");
  }
  res.redirect('back');
}