const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const productCategoryRoutes = require('./product-category.route');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const authRoutes = require('./auth.route');
const myAccount = require('./my-account.route');
const articleCategory = require('./article-category.route')
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
    app.use(`${PATH_ADMIN}/my-account`, authMiddlerware.auth, myAccount);
    app.use(`${systemConfig.prefixAdmin}/article-category`, authMiddlerware.auth, articleCategory);
}
