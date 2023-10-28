const User = require('../../models/user.model');
const Account = require('../../models/account.model');
const md5 = require('md5');

//[GET] /admin/users
module.exports.index = async (req, res) => {
  const users = await User.find({ deleted: false });
  for (const user of users) {
    if (user.updatedBy.length > 0) {
      for (let i = 0; i < user.updatedBy.length; i++) {
        const accountUpdate = await Account.findOne({ _id: user.updatedBy[i].account_id });
        user.updatedBy[i].fullName = accountUpdate.fullName;
      }
    }
  }

  res.render('admin/pages/users/index.pug', {
    pageTitle: "Danh sách tài khoản",
    users: users
  })
}

//[GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const userAccount = await User.findOne({ _id: id });
    res.render("admin/pages/users/detail.pug", {
      pageTitle: "Thông tin khách hàng",
      userAccount: userAccount
    })
  } catch (error) {
    req.flash("error", "Không thể tìm thấy khách hàng");
    res.redirect("back");
  }
}

//[GET] /admin/users/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const userAccount = await User.findOne({ _id: id }).select("-password");

  res.render("admin/pages/users/edit.pug", {
    pageTitle: "Sửa tài khoản khách hàng",
    userAccount: userAccount
  })
}

//[PATCH] /admin/users/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    const updatedBy = {
      account_id: res.locals.accountUser._id,
      updatedAt: new Date()
    }
    await User.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy
        }
      });
    req.flash("success", "Cập nhật thông tin khách hàng thành công");
  } catch (error) {
    req.flash("error", "Cập nhật thông tin khách hàng thất bại");
  }
  res.redirect("back");
}

//[PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const updatedBy = {
      account_id: res.locals.accountUser._id,
      updatedAt: new Date()
    }
    await User.updateOne(
      { _id: req.params.id },
      {
        status: req.params.status,
        $push: { updatedBy: updatedBy }
      });
    req.flash("success", "Thay đổi trạng thái tài khoản khách hàng thành công");
  } catch (error) {
    req.flash("error", "Thay đổi trạng thái tài khoản khách hàng thất bại");
  }
  res.redirect("back");
}

//[DELETE] /admin/users/delete/:id
module.exports.delete = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.params.id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.accountUser._id,
          deletedAt: new Date()
        }
      });
    req.flash("success", "Xóa tài khoản khách hàng thành công");
  } catch (error) {
    req.flash("error", "Xóa tài khoản khách hàng thất bại");
  }
  res.redirect("back");
}