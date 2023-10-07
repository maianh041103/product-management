const systemConfig = require('../../config/system');
const Account = require('../../models/account.model');
module.exports.auth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({
      token: req.cookies.token,
      deleted: false,
      status: "active"
    })
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    else {
      next();
    }
  }
}