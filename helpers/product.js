module.exports.createNewPrice = (products) => {
  let newProducts = products.map(item => {
    item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0); // Thêm 1 key cho object
    return item;
  })
  return newProducts;
}