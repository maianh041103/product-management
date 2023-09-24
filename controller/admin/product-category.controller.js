const ProductCategory = require('../../models/product-category.model');
const config = require('../../config/system');

//[GET] /admin/products-category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    const productsCategory = await ProductCategory.find(find);

    res.render('admin/pages/products-category/index.pug', {
        pageTitle: "Danh mục sản phẩm",
        productsCategory: productsCategory
    });
}

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/products-category/create.pug', {
        pageTitle: "Tạo mới danh mục sản phẩm"
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