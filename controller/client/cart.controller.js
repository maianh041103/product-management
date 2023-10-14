const Cart = require('../../models/cart.model');

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