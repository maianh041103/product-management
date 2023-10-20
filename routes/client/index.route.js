const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const searchRoute = require('./search.route');
const cartRoute = require('./cart.route');
const checkoutRoute = require('./checkout.route');
const userRoute = require('./user.route');
const categoryMiddleware = require("../../middlewares/client/productCategory.middlerware");
const cartMiddleware = require('../../middlewares/client/cartMiddleware');

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use('/', homeRoute);
    app.use('/products', productRoute);
    app.use('/search', searchRoute);
    app.use('/cart', cartRoute);
    app.use('/checkout', checkoutRoute);
    app.use('/user', userRoute);
}