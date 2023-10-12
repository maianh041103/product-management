const Role = require('../../models/role.model');
const Account = require('../../models/account.model');
const systemConfig = require('../../config/system');
const compareArrayHelper = require('../../helpers/compareArray');

//[GET] /admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({ deleted: false });
    for (const record of records) {
        //CreatedBy
        if (record.createdBy.account_id) {
            const accUser = await Account.findOne({ _id: res.locals.accountUser._id });
            record.fullName = accUser.fullName;
        }
        //End CreatedBy
        //UpdatedBy
        if (record.updatedBy.length > 0) {
            for (let i = 0; i < record.updatedBy.length; i++) {
                const accountUpdated = await Account.findOne({ _id: record.updatedBy[i].account_id });
                if (accountUpdated) {
                    record.updatedBy[i].fullName = accountUpdated.fullName;
                }
                console.log(record);
            }
        }
        //End UpdatedBy
    }
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
    if (res.locals.user.permissions.includes("roles_create")) {
        req.body.createdBy = {
            account_id: res.locals.accountUser._id
        }
        const role = new Role(req.body);
        await role.save();
        req.flash("success", "Tạo mới nhóm quyền thành công");
    } else {
        req.flash("error", "Bạn không có quyền thêm nhóm quyền");
    }

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
        const updatedBy = {
            account_id: res.locals.accountUser._id,
            updatedAt: new Date()
        }
        await Role.updateOne({ _id: req.params.id }, { ...req.body, updatedBy: updatedBy });
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
                deletedBy: {
                    account_id: res.locals.accountUser._id,
                    deletedAt: new Date()
                }
            });

        req.flash("success", "Đã xóa nhóm quyền thành công");

        res.redirect('back');
    }
    catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

//[GET] /admin/role/permissions
module.exports.permissions = async (req, res) => {
    const roles = await Role.find({ deleted: false });
    res.render('admin/pages/role/permission', {
        pageTitle: "Phân quyền",
        roles: roles
    })
}

//[PATCH] /admin/role/permissions
module.exports.permissionsPATCH = async (req, res) => {
    try {
        const updatedBy = {
            account_id: res.locals.accountUser._id,
            updatedAt: new Date()
        }
        const permissions = JSON.parse(req.body.data);
        for (let item of permissions) {
            const permissionCurrent = await Role.findOne({ _id: item.id }).select("permissions");
            if (!compareArrayHelper.compare(permissionCurrent.permissions, item.permissions))
                await Role.updateOne({ _id: item.id }, { permissions: item.permissions, $push: { updatedBy: updatedBy } });
        }
        req.flash("success", "Cập nhật nhóm quyền thành công");
    } catch (error) {
        req.flash("error", "Cập nhật nhóm quyền thất bại");
    }
    res.redirect('back');

}