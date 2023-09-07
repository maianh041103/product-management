//[GET] /admin/product
const Product = require('../../models/product.model');

module.exports.index = async (req, res) => {

    const filterStatusHelper = require('../../helpers/filterStatus');
    const filterStatus = filterStatusHelper(req.query);
    const find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    //Tim kiem
    let keyword = req.query.keyword;
    if (keyword) {
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }

    //End tim kiem

    const products = await Product.find(find);


    res.render('admin/pages/products/index.pug', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    })
}