const systemConfig = require('../../config/system');
const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
module.exports.auth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const accountUser = await Account.findOne({
      token: req.cookies.token,
      deleted: false,
      status: "active"
    }).select("-password");
    if (!accountUser) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    else {
      const roleUser = await Role.findOne({ _id: accountUser.role_id })
        .select("title permissions");
      res.locals.accountUser = accountUser;
      res.locals.user = roleUser;
      next();
    }
  }
}