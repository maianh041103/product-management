const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const productCategoryRoutes = require('./product-category.route');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const authRoutes = require('./auth.route');
const myAccountRoutes = require('./my-account.route');
const articleCategoryRoutes = require('./article-category.route');
const articleRoutes = require('./article.route');
const settingRoutes = require('./setting.route');
const orderRoutes = require('./order.route');
const userRoutes = require('./user.route');
const systemConfig = require('../../config/system');
const authMiddlerware = require('../../middlewares/admin/auth.middleware');


module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(`${PATH_ADMIN}/dashboard`, authMiddlerware.auth, dashboardRoutes);
    app.use(`${PATH_ADMIN}/products`, authMiddlerware.auth, productRoutes);
    app.use(`${PATH_ADMIN}/products-category`, authMiddlerware.auth, productCategoryRoutes);
    app.use(`${PATH_ADMIN}/roles`, authMiddlerware.auth, roleRoutes);
    app.use(`${PATH_ADMIN}/accounts`, authMiddlerware.auth, accountRoutes);
    app.use(`${PATH_ADMIN}/auth`, authRoutes);
    app.use(`${PATH_ADMIN}/my-account`, authMiddlerware.auth, myAccountRoutes);
    app.use(`${PATH_ADMIN}/articles-category`, authMiddlerware.auth, articleCategoryRoutes);
    app.use(`${PATH_ADMIN}/articles`, authMiddlerware.auth, articleRoutes);
    app.use(`${PATH_ADMIN}/settings`, authMiddlerware.auth, settingRoutes);
    app.use(`${PATH_ADMIN}/orders`, authMiddlerware.auth, orderRoutes);
    app.use(`${PATH_ADMIN}/users`, authMiddlerware.auth, userRoutes);
}
