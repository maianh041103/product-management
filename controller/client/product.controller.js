module.exports.index = (req, res) => { // Do no se noi route tu ben index.route.js nua
    res.render('client/pages/products/index.pug', {
        pageTitle: "Trang danh sách sản phẩm"
    }); // mac dinh o trang index.js tro tu thu muc view
}