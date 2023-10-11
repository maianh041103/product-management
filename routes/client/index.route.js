const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const categoryMiddlerware = require("../../middlewares/client/productCategory.middlerware");

module.exports = (app) => {
    app.use(categoryMiddlerware.category);

    app.use('/', homeRoute);

    app.use('/products', productRoute);
}