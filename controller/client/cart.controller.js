const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const productHelper = require('../../helpers/product.js');

//[GET] /cart/
module.exports.index = async (req, res) => {
  const cart = await Cart.findOne({ _id: req.cookies.cartId });
  for (const item of cart.products) {
    const product = await Product.findOne({ _id: item.product_id });
    const productNew = productHelper.calcPriceNew(product);
    productNew.totalPrice = parseInt(productNew.priceNew * item.quantity);
    item.product = productNew;
  }
  cart.totalPrice = cart.products.reduce((calc, item) => calc + item.product.totalPrice, 0);
  res.render("client/pages/cart/index.pug", {
    pageTitle: "Giỏ hàng",
    cart: cart
  });
}

//[POST] /cart/add/:id 
module.exports.addPOST = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity);
  if (productId && quantity) {
    try {
      const cart = await Cart.findOne({
        _id: cartId
      })
      const exist = cart.products.find(product => {
        return product.product_id == productId;
      })

      if (exist) {
        const totalQuantity = exist.quantity + quantity;

        await Cart.updateOne({
          _id: cartId,
          "products.product_id": productId
        }, {
          '$set': {
            "products.$.quantity": totalQuantity
          }
        })
      } else {
        await Cart.updateOne({ _id: cartId },
          {
            $push: { products: { product_id: productId, quantity: quantity } }
          })
      }
      req.flash("success", "Cập nhật giỏ hàng thành công");
    } catch (error) {
      req.flash("error", "Cập nhật giỏ hàng thất bại");
    }

  }
  res.redirect("back");
}

//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  try {
    await Cart.updateOne({ _id: req.cookies.cartId }, {
      $pull: { products: { product_id: req.params.productId } }
    })
    req.flash("success", "Xóa sản phẩm thành công");
  } catch (error) {
    req.flash("error", "Xóa sản phẩm thất bại");
  }
  res.redirect("back");
}

//[GET] /cart/update/:productId/:quatity
module.exports.update = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = req.params.quantity;
    await Cart.updateOne({
      _id: req.cookies.cartId,
      "products.product_id": productId
    }, {
      '$set': {
        "products.$.quantity": quantity
      }
    })
    req.flash("success", "Cập nhật số lượng thành công");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật số lượng sản phẩm thất bại");
  }
  res.redirect("back");
}