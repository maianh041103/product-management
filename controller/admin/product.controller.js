//[GET] /admin/product
const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');

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

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

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
    await Product.updateOne({ _id: id }, { status: status });
    res.redirect('back');
}
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // req.body : tra ve object do form tra ve
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    //updateMany(filter,update,option)
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            break;
    }
    res.redirect('back');
}
