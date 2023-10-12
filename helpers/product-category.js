const ProductCategory = require('../models/product-category.model');

module.exports.getSubCategory = async (parentId) => {
  const subCategory = async (parentId) => {
    const getCategory = await ProductCategory.find({
      deleted: false,
      status: "active",
      parent_id: parentId
    })
    let result = [...getCategory];
    for (const item of getCategory) {
      result = result.concat(await subCategory(item._id));
    }
    return result;
  }
  const result = await subCategory(parentId);
  return result;
}