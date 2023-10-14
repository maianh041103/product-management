const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination')
const treeHelper = require('../../helpers/createTree');
const systemConfig = require('../../config/system');
const Article = require('../../models/article.model');
const ArticleCategory = require('../../models/article-category.model');
const Account = require('../../models/account.model');

//[GET] /admin/article/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }
  const filterStatus = filterStatusHelper(req.query);

  const objectSearch = searchHelper(req.query);
  if (objectSearch.keyword)
    find.title = objectSearch.regex;

  const articles = await Article.find(find)

  for (const article of articles) {
    if (article.createdBy) {
      const account = await Account.findOne({
        deleted: false,
        _id: res.locals.accountUser.id,
      })
      if (account) {
        article.fullName = account.fullName;
      }
    }
  }

  //Pagination
  let objectPagination = {
    limitItems: 4,
    currentPage: 1
  }

  const countProducts = await Article.countDocuments(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);;

  objectPagination = paginationHelper(objectPagination, req.query, countProducts);
  //End pagination

  res.render('admin/pages/article/index.pug', {
    pageTitle: "Danh sách sản phẩm",
    articles: articles,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    articles: articles,
    pagination: objectPagination
  });
}

//[GET] /admin/article/create
module.exports.create = async (req, res) => {
  const articles = await Article.find({ deleted: false });
  const articlesCategory = await ArticleCategory.find({ deleted: false });
  articlesCategoryTree = treeHelper.createTree(articlesCategory);

  res.render('admin/pages/article/create', {
    pageTitle: "Tạo mới bài viết",
    articles: articles,
    articlesCategory: articlesCategoryTree
  })
}

//[POST] /admin/article/create
module.exports.createPOST = async (req, res) => {
  try {
    req.body.createdBy = {
      account_id: res.locals.accountUser.id
    }
    const article = new Article(req.body);
    await article.save();

    req.flash("success", "Thêm mới bài viết thành công");
  } catch (error) {
    req.flash("error", "Thêm mới bài viết thất bại");
  }
  res.redirect(`${systemConfig.prefixAdmin}/articles`);
}

//[PATCH] /admin/articles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const updatedBy = {
      account_id: res.locals.accountUser.id,
      updatedAt: new Date()
    }
    await Article.updateOne(
      { _id: req.params.id },
      { status: req.params.status });
    req.flash("success", "Thay đổi trạng thái bài viết thành công");
  } catch (error) {
    req.flash("error", "Thay đổi trạng thái bài viết thất bại");
  }
  res.redirect("back");
}