const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const newCart = new Cart();
    await newCart.save();
    const time = 31536000000;
    res.cookie("cartId", newCart.id, { expires: new Date(time + Date.now()) })

  } else {
    console.log("Da co");
  }

  next();
}