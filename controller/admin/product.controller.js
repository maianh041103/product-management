//[GET] /admin/product
const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');

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

    const products = await Product.find(find);

    res.render('admin/pages/products/index.pug', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    })
}