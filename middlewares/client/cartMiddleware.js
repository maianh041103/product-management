const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const newCart = new Cart();
    await newCart.save();
    const time = 31536000000;
    res.cookie("cartId", newCart.id, { expires: new Date(time + Date.now()) })

  } else {
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    if (cart) {
      if (cart.products.length > 0) {
        cart.totalQuantity = cart.products.reduce((calc, item) => {
          return calc + item.quantity;
        }, 0)
      }
    }
    res.locals.minicart = cart;
  }

  next();
}