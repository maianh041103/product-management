const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');
const Account = require('../../models/account.model');
const createTreeHelper = require('../../helpers/createTree');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const config = require('../../config/system');

//[GET] /admin/product
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    const find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    //Tim kiem
    const objectSearch = searchHelper(req.query);
    if (objectSearch.keyword)
        find.title = objectSearch.regex;
    //End tim kiem

    //Pagination
    let objectPagination = {
        limitItems: 4,
        currentPage: 1
    }

    const countProducts = await Product.countDocuments(find);

    objectPagination = paginationHelper(objectPagination, req.query, countProducts);
    //End pagination

    //Sort
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const sort = {};
    if (sortKey && sortValue) {
        sort[sortKey] = sortValue;
    }
    else {
        sort['position'] = 'desc';
    }
    //End Sort

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for (const product of products) {
        //CreatedBy
        if (product.createdBy.account_id) {
            const accUser = await Account.findOne({ _id: product.createdBy.account_id });
            if (accUser) {
                product.fullName = accUser.fullName;
            }
        }
        //End CreatedBy
        //UpdatedBy
        if (product.updatedBy.length > 0) {
            for (let i = 0; i < product.updatedBy.length; i++) {
                const accountUpdated = await Account.findOne({ _id: product.updatedBy[i].account_id, deleted: false });
                if (accountUpdated) {
                    product.updatedBy[i].fullName = accountUpdated.fullName;
                }
            }
        }
        //End UpdatedBy
    }

    res.render('admin/pages/products/index.pug', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.accountUser._id,
        updatedAt: new Date()
    }
    await Product.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } });
    req.flash("success", "Bạn đã cập nhật thành công");
    res.redirect('back');
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // req.body : tra ve object do form tra ve
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
        account_id: res.locals.accountUser._id,
        updatedAt: new Date()
    }
    //updateMany(filter,update,option)
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });
            req.flash("success", "Bạn đã chuyển trạng thái active thành công");
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } });
            req.flash("success", "Bạn đã chuyển trạng thái inactive thành công");
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: "true",
                deletedBy: {
                    account_id: res.locals.accountUser._id,
                    deleteAt: new Date()
                }
            });
            req.flash("success", "Bạn đã xóa thành công");
            break;
        case "change-position":
            for (const item of ids) {
                [id, position] = item.split('-');
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position, $push: { updatedBy: updatedBy } });
            }
            req.flash("success", "Bạn đã thay đổi thứ tự thành công");
            break;
    }
    res.redirect('back');
}

//[DELETE] /admin/products/delete-item/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.accountUser._id,
            deleteAt: new Date()
        }
    }
    );
    req.flash("success", `Đã xóa thành công sản phẩm!`);

    res.redirect('back');
}

//[GET] /admin/products/create
module.exports.ceate = async (req, res) => {
    const productsCategory = await ProductCategory.find({ deleted: false });
    const newProductsCategory = createTreeHelper.createTree(productsCategory);
    res.render('admin/pages/products/create.pug', {
        pageTitle: "Thêm mới một sản phẩm",
        productsCategory: newProductsCategory
    });
}

//[POST] /admin/products/create
module.exports.ceatePOST = async (req, res) => {
    if (res.locals.user.permissions.includes("products_create")) {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);

        if (req.body.position == '') {
            req.body.position = await Product.count() + 1;
        }
        else {
            req.body.position = parseInt(req.body.position);
        }

        req.body.createdBy = { account_id: res.locals.accountUser._id };

        //create 1 bản ghi vào mongoose 
        const product = new Product(req.body);

        //Lưu vào mongoose  
        await product.save();

        req.flash("success", "Thêm sản phẩm thành công");
    }
    else {
        req.flash("error", "Bạn không có quyền thêm sản phẩm");
    }

    res.redirect(`${config.prefixAdmin}/products`);
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const find = {
            _id: id,
            deleted: false
        }
        const product = await Product.findOne(find);
        const productsCategory = await ProductCategory.find({ deleted: false });
        const newProductsCategory = createTreeHelper.createTree(productsCategory);

        res.render('admin/pages/products/edit.pug', {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            productsCategory: newProductsCategory
        });
    } catch (error) {
        res.redirect(`${config.prefixAdmin}/products`);
    }

}

//[PATCH] /admin/products/edit:id
module.exports.editPATCH = async (req, res, next) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    const updatedBy = {
        account_id: res.locals.accountUser._id,
        updatedAt: new Date()
    }
    try {
        await Product.updateOne({ _id: id }, { ...req.body, $push: { updatedBy: updatedBy } });
        req.flash("success", "Cập nhật sản phẩm thành công");
    } catch (error) {
        req.flash("error", "Cập nhật sản phẩm thất bại");
    }
    res.redirect('back');
}

//[GET] /admin/products/detail
module.exports.detail = async (req, res) => {
    try {
        const find = {
            _id: req.params.id,
            deleted: false
        }
        const product = await Product.findOne(find);

        const productCategory = await ProductCategory.findOne({ _id: product.productCategory });

        res.render('admin/pages/products/detail.pug', {
            pageTitle: "Chi tiết sản phẩm",
            product: product,
            productCategory: productCategory
        });

    } catch (error) {
        req.flash("error", "Lấy thông tin hiển thị chi tiết sản phẩm thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}
