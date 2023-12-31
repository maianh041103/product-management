const Product = require('../../models/product.model');
const productHelper = require('../../helpers/product');

//[GET] /
module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    }).limit(6);

    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" }).limit(6);
    const newProductsFeatured = productHelper.createNewPrice(productsFeatured);
    const newProductsNew = productHelper.createNewPrice(productsNew);
    res.render("client/pages/home/index.pug",
        {
            pageTitle: "Trang chủ",
            productsFeatured: newProductsFeatured,
            newProducts: newProductsNew
        }); // mac dinh o trang index.js tro tu thu muc view
}