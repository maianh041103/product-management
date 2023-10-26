const SettingGeneral = require('../../models/settings-general.model');

module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.render('admin/pages/settings/general.pug', {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral
  })
}

module.exports.generalPATCH = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  if (settingGeneral) {
    await SettingGeneral.updateOne({ _id: settingGeneral.id }, req.body);
    req.flash("success", "Cập nhật cài đặt chung thành công");
  } else {
    const newSettingGeneral = new SettingGeneral(req.body);
    await newSettingGeneral.save();
    req.flash("success", "Tạo mới cài đặt chung thành công")
  }
  res.redirect("back");
}