const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');
//[GET] /admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({ deleted: false });
    res.render('admin/pages/role/index.pug', {
        pageTitle: "Trang phân quyền",
        records: records
    })
}

//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/role/create.pug', {
        pageTitle: "Trang tạo mới nhóm quyền"
    });
}

//[POST] /admin/roles/create
module.exports.createPOST = async (req, res) => {
    const role = new Role(req.body);
    await role.save();
    req.flash("success", "Tạo mới nhóm quyền thành công");

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

//[GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    const role = await Role.findOne({
        _id: req.params.id,
        deleted: false
    })
    res.render('admin/pages/role/detail.pug', {
        pageTitle: "Trang chi tiết nhóm quyền",
        role: role
    })
}

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const role = await Role.findOne({
            deleted: false,
            _id: req.params.id
        })
        res.render('admin/pages/role/edit', {
            pageTitle: "Trang chỉnh sửa nhóm quyền",
            role: role
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

//[PATCH] /admin/role/edit/:id
module.exports.editPATCH = async (req, res) => {
    try {
        await Role.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", "Bạn đã thay đổi nhóm quyền thành công");
        res.redirect('back');
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

//[DELETE] /admin/role/delete/:id
module.exports.delete = async (req, res) => {
    try {
        await Role.updateOne({ _id: req.params.id },
            {
                deleted: true,
                deletedAt: new Date()
            });

        req.flash("success", "Đã xóa nhóm quyền thành công");

        res.redirect('back');
    }
    catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}