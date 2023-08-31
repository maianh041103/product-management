//[GET] /product

const Product = require('../../models/product.model')



module.exports.index = async (req, res) => { // Do nó sẽ nối route từ bên index.route.js nữa
    const products = await Product.find({
        status: "active",
        deleted: false
    });
    // Truyền vào find là 1 object các sản phẩm muốn tìm

    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0); // Thêm 1 key cho object
        return item;
    })

    res.render('client/pages/products/index.pug', {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts
    }); // mặc định ở trang index.js trỏ từ thư mục view
}