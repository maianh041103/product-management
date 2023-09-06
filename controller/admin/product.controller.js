//[GET] /admin/product
const Product = require('../../models/product.model');

module.exports.index = async (req, res) => {

    const filterStatus = [
        {
            name: "Tất cả",
            status: "",
            //class: "active"
        },
        {
            name: "Đang hoạt động",
            status: "active"
        },
        {
            name: "Dừng hoạt động",
            status: "inactive"
        }
    ]
    let index;
    if (req.query.status) {
        index = filterStatus.findIndex(item => item.status == req.query.status)
    } else {
        index = filterStatus.findIndex(item => item.status == "")
    }
    filterStatus[index].class = "active";

    const find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    //Tim kiem
    let keyword = req.query.keyword;
    if (keyword) {
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }

    //End tim kiem

    const products = await Product.find(find);


    res.render('admin/pages/products/index.pug', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    })
}