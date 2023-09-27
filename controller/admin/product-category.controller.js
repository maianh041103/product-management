const ProductCategory = require('../../models/product-category.model');
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
        limitItems: 10,
        currentPage: 1,
    }
    const count = await ProductCategory.countDocuments(find);

    objectPagination = paginationHelper(objectPagination, req.query, count);

    //End pagination

    //Sort
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const sort = {};
    if (sortKey && sortValue) {
        sort[sortKey] = sortValue;
    } else {
        sort["position"] = "desc";
    }
    //End Sort

    const productsCategory = await ProductCategory.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        .sort(sort)

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
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const count = await ProductCategory.count({
            deleted: false
        });
        req.body.position = count + 1;
    }

    const record = new ProductCategory(req.body);

    await record.save();

    req.flash("success", "Thêm danh mục sản phẩm thành công");

    res.redirect(`${config.prefixAdmin}/products-category`);
}

//[PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, { status: status });
    req.flash("success", "Bạn đã cập nhật thành công");
    res.redirect('back');
}

//[PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');
    if (type && ids) {
        switch (type) {
            case "active":
                await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" });
                req.flash("success", "Cập nhật trạng thái active thành công");
                break;
            case "inactive":
                await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" })
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
                    await ProductCategory.updateOne({ _id: id }, { position: position });
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
        deleteAt: new Date()
    })
    req.flash("success", "Đã xóa thành công 1 bản ghi")
    res.redirect('back');
}

//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    const productCategory = await ProductCategory.findOne({
        deleted: false,
        _id: req.params.id
    })
    res.render('admin/pages/products-category/edit', {
        pageTitle: "Chỉnh sửa danh mục sản phẩm",
        productCategory: productCategory
    });
}

//[PATCH] /admin/products-category/edit/:id
module.exports.editPATCH = async (req, res) => {
    req.body.position = parseInt(req.body.position);
    const id = req.params.id;
    try {
        await ProductCategory.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật sản phẩm thành công");
    } catch (error) {
        req.flash("error", "Cập nhật sản phẩm thất bại");
    }
    res.redirect("back");
}

//[GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    const productCategory = await ProductCategory.findOne({
        deleted: false,
        _id: req.params.id
    })
    res.render('admin/pages/products-category/detail.pug', {
        pageTitle: "Trang chi tiết danh mục sản phẩm",
        productCategory: productCategory
    });
}