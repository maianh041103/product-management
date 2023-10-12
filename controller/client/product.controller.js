const Product = require('../../models/product.model')
const ProductCategory = require('../../models/product-category.model');
const productHelper = require('../../helpers/product');
const ProductCategoryHelper = require('../../helpers/product-category');

//[GET] /product
module.exports.index = async (req, res) => { // Do nó sẽ nối route từ bên index.route.js nữa
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" })
        ;
    // Truyền vào find là 1 object các sản phẩm muốn tìm

    const newProducts = productHelper.createNewPrice(products);

    res.render('client/pages/products/index.pug', {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts
    }); // mặc định ở trang index.js trỏ từ thư mục view
}

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            status: "active",
            slug: req.params.slug
        }

        const product = await Product.findOne(find);

        res.render('client/pages/products/detail.pug', {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`/products`);
    }
}

//[GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const productCategory = await ProductCategory.findOne({
        deleted: false,
        status: "active",
        slug: req.params.slugCategory
    })
    const productsChildren = await ProductCategoryHelper.getSubCategory(productCategory._id);
    productsChildrenId = productsChildren.map(item => item.id);

    const products = await Product.find({
        deleted: false,
        productCategory: { $in: [productCategory.id, ...productsChildrenId] }
    });
    console.log(products);
    const productsNew = productHelper.createNewPrice(products);
    console.log(productsNew);
    res.render('client/pages/products/index', {
        pageTitle: productCategory.title,
        products: productsNew
    })
}