const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const productHelper = require('../../helpers/product.js');
const Order = require('../../models/order.model');

//[GET] /checkout/
module.exports.index = async (req, res) => {
  const cart = await Cart.findOne({ _id: req.cookies.cartId });
  for (const item of cart.products) {
    const product = await Product.findOne({ _id: item.product_id });
    const productNew = productHelper.calcPriceNew(product);
    productNew.totalPrice = parseInt(productNew.priceNew * item.quantity);
    item.product = productNew;
  }
  cart.totalPrice = cart.products.reduce((calc, item) => calc + item.product.totalPrice, 0);
  res.render('client/pages/checkout/index.pug', {
    pageTitle: "Đặt hàng",
    cart: cart
  });
}

//[POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;
  const cart = await Cart.findOne({ _id: cartId });
  const productsCart = cart.products;
  let products = [];
  for (const item of productsCart) {
    const product = await Product.findOne({ _id: item.product_id });
    const objectProduct = {
      product_id: product._id,
      price: product.price,
      discountPercentage: product.discountPercentage,
      quantity: item.quantity
    }
    products.push(objectProduct);
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products
  }
  const order = new Order(orderInfo);
  order.save();

  await Cart.updateOne({ _id: cartId }, {
    products: []
  })

  res.redirect(`/checkout/success/${order.id}`);
}

module.exports.success = async (req, res) => {
  console.log(req.params.orderId);
  res.render("client/pages/checkout/success.pug", {
    pageTitle: "Mua hàng thành công",
  })
}