const Product = require('../../models/product.model');
const productHelper = require('../../helpers/product');

module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
    status: "active"
  }

  const keyword = req.query.keyword;
  if (keyword) {
    const regex = new RegExp(keyword, "i");
    find.title = regex;
  }

  const products = await Product.find(find);
  const newProducts = productHelper.createNewPrice(products);

  res.render('client/pages/search/index', {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts
  })
}