const ProductCategory = require('../../models/product-category.model');
const Account = require('../../models/account.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const config = require('../../config/system');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const createTreeHelper = require('../../helpers/createTree');

//[GET] /admin/products-category
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    const find = {
        deleted: false
    }

    //Loc theo trang thai
    const status = req.query.status;
    if (status) {
        find["status"] = status;
    }
    //End loc theo trang thai

    //Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    //End Search

    //Pagination
    let objectPagination = {
        limitItems: 20,
        currentPage: 1,
    }
    const count = await ProductCategory.countDocuments(find);

    objectPagination = paginationHelper(objectPagination, req.query, count);

    //End pagination

    //Sort
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    let sort = {};
    if (sortKey && sortValue) {
        sort[sortKey] = sortValue;
    } else {
        sort["position"] = "desc";
    }
    //End Sort

    const productsCategory = await ProductCategory.find(find);
    for (const productCategory of productsCategory) {
        // CreatedBy
        if (productCategory.createdBy.account_id) {
            const accUser = await Account.findOne({ _id: productCategory.createdBy.account_id })
            productCategory.fullName = accUser.fullName;
        }
        //End CreatedBy
        //UpdatedBy
        if (productCategory.updatedBy.length > 0) {
            for (let i = 0; i < productCategory.updatedBy.length; i++) {
                const accountUpdater = await Account.findOne({ _id: productCategory.updatedBy[i].account_id });
                if (accountUpdater) {
                    productCategory.updatedBy[i].fullName = accountUpdater.fullName;
                }
            }
        }
    }

    //Không sắp xếp được theo tiêu chí
    // .sort(sort)
    // .limit(objectPagination.limitItems)
    // .skip(objectPagination.skip)


    const newProductsCategory = createTreeHelper.createTree(productsCategory);

    res.render('admin/pages/products-category/index.pug', {
        pageTitle: "Danh mục sản phẩm",
        productsCategory: newProductsCategory,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//[GET] /admin/products-category/create

module.exports.create = async (req, res) => {
    const productsCategory = await ProductCategory.find({ deleted: false });
    const newProductsCategory = createTreeHelper.createTree(productsCategory);
    res.render('admin/pages/products-category/create.pug', {
        pageTitle: "Tạo mới danh mục sản phẩm",
        productsCategory: newProductsCategory
    })
}

//[POST] /admin/products-category/create
module.exports.createPOST = async (req, res) => {
    if (res.locals.user.permissions.includes("products-category_create")) {
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            const count = await ProductCategory.count({
                deleted: false
            });
            req.body.position = count + 1;
        }

        req.body.createdBy = { account_id: res.locals.accountUser._id }

        const record = new ProductCategory(req.body);

        await record.save();

        req.flash("success", "Thêm danh mục sản phẩm thành công");
    }
    else {
        req.flash("error", "Bạn không có quyền thêm danh mục sản phẩm");
    }

    res.redirect(`${config.prefixAdmin}/products-category`);
}

//[PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.accountUser._id,
        updatedAt: new Date()
    }

    await ProductCategory.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } });
    req.flash("success", "Bạn đã cập nhật thành công");
    res.redirect('back');
}

//[PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');
    const updatedBy = {
        account_id: res.locals.accountUser._id,
        updatedAt: new Date()
    }
    if (type && ids) {
        switch (type) {
            case "active":
                await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });
                req.flash("success", "Cập nhật trạng thái active thành công");
                break;
            case "inactive":
                await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } })
                req.flash("success", "Cập nhật trạng thái dừng hoạt động thành công");
                break;
            case "delete-all":
                await ProductCategory.updateMany({ _id: { $in: ids } }, {
                    deleted: true,
                    deleteAt: new Date()
                })
                req.flash("success", "Xóa bản ghi thành công");
                break;
            case "change-position":
                for (let value of ids) {
                    let [id, position] = value.split('-');
                    position = parseInt(position);
                    await ProductCategory.updateOne({ _id: id }, { position: position, $push: { updatedBy: updatedBy } });
                }
                req.flash("success", "Thay đổi vị trí thành công");
                break;
            default:
                alert("vui lòng chọn tiêu chí cần cập nhật");
        }
    }
    res.redirect('back');
}

//[DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await ProductCategory.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.accountUser._id,
            deletedAt: new Date()
        }
    })
    req.flash("success", "Đã xóa thành công 1 bản ghi")
    res.redirect('back');
}

//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const productsCategory = await ProductCategory.find({
            deleted: false
        })
        const productCategory = await ProductCategory.findOne({
            deleted: false,
            _id: req.params.id
        })
        const newProductsCategory = createTreeHelper.createTree(productsCategory);
        res.render('admin/pages/products-category/edit', {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            productsCategory: newProductsCategory,
            productCategory: productCategory
        });
    } catch (error) {
        res.redirect(`${config.prefixAdmin}/products-category`);
    }
}

//[PATCH] /admin/products-category/edit/:id
module.exports.editPATCH = async (req, res) => {
    req.body.position = parseInt(req.body.position);
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.accountUser._id,
        updatedAt: new Date()
    }
    try {
        await ProductCategory.updateOne({ _id: id }, { ...req.body, $push: { updatedBy: updatedBy } });
        req.flash("success", "Cập nhật sản phẩm thành công");
    } catch (error) {
        req.flash("error", "Cập nhật sản phẩm thất bại");
    }
    res.redirect("back");
}

//[GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const productCategory = await ProductCategory.findOne({
            deleted: false,
            _id: req.params.id
        })
        let valueRender = {
            pageTitle: "Trang chi tiết danh mục sản phẩm",
            productCategory: productCategory
        }
        if (productCategory.parent_id) {
            const productCategoryParent = await ProductCategory.findOne({
                deleted: false,
                _id: productCategory.parent_id
            })
            valueRender.productCategoryParent = productCategoryParent;
        }
        res.render('admin/pages/products-category/detail.pug', valueRender);

    } catch (error) {
        res.redirect(`${config.prefixAdmin}/products-category`);
    }
}