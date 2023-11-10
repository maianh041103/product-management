const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const searchRoute = require('./search.route');
const cartRoute = require('./cart.route');
const checkoutRoute = require('./checkout.route');
const userRoute = require('./user.route');
const articleRoute = require('./article.route');
const chatRoute = require('./chat.route');
const usersRoute = require('./users.route');
const roomChatRoute = require('./room-chat.route');
const categoryMiddleware = require("../../middlewares/client/productCategory.middlerware");
const articleMiddleware = require("../../middlewares/client/articleCategory.middleware");
const cartMiddleware = require('../../middlewares/client/cartMiddleware');
const userMiddleware = require('../../middlewares/client/user.middleware');
const settingGeneralMiddleware = require('../../middlewares/client/settingGeneral.middleware');
const authMiddlerware = require('../../middlewares/client/auth.middlerware');

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(articleMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.user);
    app.use(settingGeneralMiddleware.settingGeneral);
    app.use('/', homeRoute);
    app.use('/products', productRoute);
    app.use('/search', searchRoute);
    app.use('/cart', cartRoute);
    app.use('/checkout', checkoutRoute);
    app.use('/user', userRoute);
    app.use('/articles', articleRoute);
    app.use('/chat', authMiddlerware.requireAuth, chatRoute);
    app.use('/users', authMiddlerware.requireAuth, usersRoute);
    app.use('/rooms-chat', authMiddlerware.requireAuth, roomChatRoute);
}