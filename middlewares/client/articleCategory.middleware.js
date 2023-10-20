const ArticleCategory = require('../../models/article-category.model');
const createTreeHelper = require('../../helpers/createTree');

module.exports.category = async (req, res, next) => {
  const articlesCategory = await ArticleCategory.find({
    deleted: false,
    status: "active"
  });
  const newArticlesCategory = createTreeHelper.createTree(articlesCategory);
  res.locals.layoutArticlesCategory = newArticlesCategory;
  next();
}