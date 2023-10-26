const Account = require('../../models/account.model');
const ProductCategory = require('../../models/product-category.model');
const Product = require('../../models/product.model');
const User = require('../../models/user.model');

// [GET] /admin/dashboard

module.exports.dashboard = async (req, res) => {
    const account = await Account.findOne({ token: req.cookies.token });
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0
        }
    };

    statistic.categoryProduct.total = await ProductCategory.count({ deleted: false });
    statistic.categoryProduct.active = await ProductCategory.count({ deleted: false, status: "active" });
    statistic.categoryProduct.inactive = await ProductCategory.count({ deleted: false, status: "inactive" });

    statistic.product.total = await Product.count({ deleted: false });
    statistic.product.active = await Product.count({ deleted: false, status: "active" });
    statistic.product.inactive = await Product.count({ deleted: false, status: "inactive" });

    statistic.account.total = await Account.count({ deleted: false });
    statistic.account.active = await Account.count({ deleted: false, status: "active" });
    statistic.account.inactive = await Account.count({ deleted: false, status: "inactive" });

    statistic.user.total = await User.count({ deleted: false });
    statistic.user.active = await User.count({ deleted: false, status: "active" });
    statistic.user.inactive = await User.count({ deleted: false, status: "inactive" });

    res.render('admin/pages/dashboard/index.pug', {
        pageTitle: "Trang tổng quan",
        account: account,
        statistic: statistic
    })
}