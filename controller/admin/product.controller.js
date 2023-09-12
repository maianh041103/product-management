const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');

//[GET] /admin/product
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    const find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    //Tim kiem
    const objectSearch = searchHelper(req.query);
    if (objectSearch.keyword)
        find.title = objectSearch.regex;
    //End tim kiem

    //Pagination
    let objectPagination = {
        limitItems: 4,
        currentPage: 1
    }

    const countProducts = await Product.countDocuments(find);

    objectPagination = paginationHelper(objectPagination, req.query, countProducts);
    //End pagination

    const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render('admin/pages/products/index.pug', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { status: status });
    req.flash("success", "Bạn đã cập nhật thành công");
    res.redirect('back');
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // req.body : tra ve object do form tra ve
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    //updateMany(filter,update,option)
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", "Bạn đã chuyển trạng thái active thành công");
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", "Bạn đã chuyển trạng thái inactive thành công");
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: "true",
                deleteAt: new Date()
            });
            req.flash("success", "Bạn đã xóa thành công");
            break;
        case "change-position":
            for (const item of ids) {
                [id, position] = item.split('-');
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            req.flash("success", "Bạn đã thay đổi thứ tự thành công");
            break;
    }
    res.redirect('back');
}

//[DELETE] /admin/products/delete-item/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    //await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deleteAt: new Date()
    }
    );
    res.redirect('back');
}
