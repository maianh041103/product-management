const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');
const md5 = require('md5');

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  const accounts = await Account.find({ deleted: false })
    .select("-password -token");

  for (let account of accounts) {
    const role = await Role.findOne({ _id: account.role_id });
    account.role = role;
  }
  res.render('admin/pages/accounts/index', {
    pageTitle: "Danh sách tài khoản",
    accounts: accounts
  })
}

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({ deleted: false });
  res.render('admin/pages/accounts/create', {
    pageTitle: "Thêm mới tài khoản",
    roles: roles
  })
}

//[POST] /admin/accounts/create
module.exports.createPOST = async (req, res) => {
  const emailExist = await Account.findOne({ deleted: false, email: req.body.email });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect("back");
  }
  else {
    req.body.password = md5(req.body.password);
    const account = new Account(req.body);
    await account.save();
    req.flash("success", "Tạo mới tài khoản thành công");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const account = await Account.findOne({
    _id: req.params.id,
    deleted: false
  })
  try {
    const roles = await Role.find({
      deleted: false
    })
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      account: account,
      roles: roles
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

//[PATCH] /admin/accounts/edit/:id
module.exports.editPATCH = async (req, res) => {
  const email = req.body.email;
  const account = await Account.findOne({
    deleted: false,
    _id: { $ne: req.params.id },
    email: email
  })
  if (account) {
    req.flash("error", `Email ${email} đã tồn tại`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    }
    else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cập nhật thông tin tài khoản thành công");
  }

  res.redirect("back");
}