const Order = require("../../models/order.model");
const productHelper = require('../../helpers/product');
const statusOrderHelper = require('../../helpers/statusOrder');

module.exports.index = async (req, res) => {
  const orders = await Order.find({});
  for (const order of orders) {
    order.newProducts = productHelper.createNewPrice(order.products);

    order.totalPrice = order.newProducts.reduce((calc, item) => {
      return calc + item.priceNew * item.quantity;
    }, 0)

    order.totalQuantity = order.newProducts.reduce((calc, item) => {
      return calc + item.quantity;
    }, 0)

    const time = statusOrderHelper.statusOrder(order.createdAt);
    order.time = time;
  }

  keyword = "";

  console.log(orders);
  res.render("admin/pages/orders/index.pug", {
    pageTitle: "Đơn hàng",
    orders: orders,
    keyword: keyword
  })
}