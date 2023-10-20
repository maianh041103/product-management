const Article = require('../../models/article.model');
const ArticleCategory = require('../../models/article-category.model');
const productCategoryHelper = require('../../helpers/product-category');

//[GET] /articles
module.exports.index = async (req, res) => {
  const articles = await Article.find({
    deleted: false,
    status: "active"
  })

  res.render("client/pages/article/index.pug", {
    pageTitle: "Danh sách bài viết",
    articles: articles
  });
}

//[GET] /articles/:SlugCategory
module.exports.category = async (req, res) => {
  const articleCategory = await ArticleCategory.findOne(
    {
      deleted: false,
      status: "active",
      slug: req.params.slugCategory
    }
  )
  const articlesCategoryChildren = await productCategoryHelper.getSubCategory(articleCategory.id, ArticleCategory)

  const articlesCategoryChildrenId = articlesCategoryChildren.map((item) => {
    return item.id;
  })

  articlesCategoryChildrenId.push(articleCategory.id);

  let articles = [];
  for (const articleCategoryChildrenId of articlesCategoryChildrenId) {
    let tmp = await Article.find({ articleCategory: articleCategoryChildrenId });
    articles = articles.concat(tmp);
  }
  res.render("client/pages/article/index.pug", {
    pageTitle: articleCategory.title,
    articles: articles
  })
}

//[GET] /articles/detail/:slug
module.exports.detail = async (req, res) => {
  const article = await Article.findOne({
    deleted: false,
    status: "active",
    slug: req.params.slug
  })

  const articleCategory = await ArticleCategory.findOne({
    _id: article.articleCategory,
    deleted: false
  })

  article.categorySlug = articleCategory.slug;
  article.categoryTitle = articleCategory.title;

  res.render("client/pages/article/detail.pug", {
    pageTitle: article.title,
    article: article
  })
}