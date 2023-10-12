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
    //Created By
    if (account.createdBy.account_id) {
      const accUser = await Account.findOne({ _id: res.locals.accountUser._id });
      account.fullNameCreate = accUser.fullName;
    }
    //End CreatedBy
    //Updated By
    if (account.updatedBy.length > 0) {
      for (let i = 0; i < account.updatedBy.length; i++) {
        const accountUpdated = await Account.findOne({ _id: account.updatedBy[i].account_id, deleted: false });
        if (accountUpdated) {
          account.updatedBy[i].fullName = accountUpdated.fullName;
        }
      }
    }
    //End Updated By
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
  if (res.locals.user.permissions.includes("account_create")) {
    const emailExist = await Account.findOne({ deleted: false, email: req.body.email });
    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại`);
      res.redirect("back");
    }
    else {
      req.body.password = md5(req.body.password);
      req.body.createdBy = {
        account_id: res.locals.accountUser._id
      }
      const account = new Account(req.body);
      await account.save();
      req.flash("success", "Tạo mới tài khoản thành công");
    }
  } else {
    req.flash("error", "Bạn không có quyền thêm mới tài khoản");
  }
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}

//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {

  try {
    const account = await Account.findOne({
      _id: req.params.id,
      deleted: false
    })

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

//[PATCH] /admin/accounts/edit
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
    const updatedBy = {
      account_id: res.locals.accountUser._id,
      updatedAt: new Date()
    }

    await Account.updateOne({ _id: req.params.id }, { ...req.body, $push: { updatedBy: updatedBy } });
    req.flash("success", "Cập nhật thông tin tài khoản thành công");
  }

  res.redirect("back");
}

//[GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, deleted: false });

    const role = await Role.findOne({ _id: account.role_id });
    account.role = role;

    res.render("admin/pages/accounts/detail.pug", {
      pageTitle: "Chi tiết tài khoản",
      account: account
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

//[DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    await Account.updateOne(
      { _id: req.params.id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.accountUser._id,
          deletedAt: new Date()
        }
      });
    req.flash("success", "Xóa tài khoản thành công");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Xóa tài khoản thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

//[PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    await Account.updateOne({ _id: req.params.id }, { status: req.params.status });
    req.flash("success", "Cập nhật trạng thái thành công");
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại");
  }
  res.redirect("back");
}

