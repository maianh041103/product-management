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

  //Loc trang thai
  if (req.query.status) {
    find.status = req.query.status
  }
  //End loc trang thai

  //Find
  const objectSearch = searchHelper(req.query);
  if (objectSearch.keyword)
    find.title = objectSearch.regex;
  //End find

  //Sort
  const sortKey = req.query.sortKey;
  const sortValue = req.query.sortValue;
  let sort = {};
  if (sortKey && sortValue) {
    sort[sortKey] = sortValue;
  } else {
    sort["title"] = "asc"
  }
  //End Sort

  //Pagination
  let objectPagination = {
    limitItems: 4,
    currentPage: 1
  }

  const countArticles = await Article.countDocuments(find)

  objectPagination = paginationHelper(objectPagination, req.query, countArticles);
  //End pagination

  const articles = await Article.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);;

  for (const article of articles) {
    //Created
    if (article.createdBy) {
      const account = await Account.findOne({
        deleted: false,
        _id: res.locals.accountUser.id,
      })
      if (account) {
        article.fullName = account.fullName;
      }
    }

    //Updated
    if (article.updatedBy.length > 0) {
      for (let i = 0; i < article.updatedBy.length; i++) {
        const accountUpdate = await Account.findOne({ _id: article.updatedBy[i].account_id });
        article.updatedBy[i].fullName = accountUpdate.fullName
      }
    }
  }

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
      {
        status: req.params.status,
        $push: { updatedBy: updatedBy }
      });
    req.flash("success", "Thay đổi trạng thái bài viết thành công");
  } catch (error) {
    req.flash("error", "Thay đổi trạng thái bài viết thất bại");
  }
  res.redirect("back");
}

//[GET] /admin/articles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const article = await Article.findOne({
      _id: req.params.id,
      deleted: false
    })

    const articleCategory = await ArticleCategory.findOne({
      _id: article.articleCategory
    })

    article.articleCategoryName = articleCategory.title;

    const accountCreated = await Account.findOne({
      _id: article.createdBy.account_id
    })
    article.accountCreatedName = accountCreated.fullName;

    res.render('admin/pages/article/detail.pug', {
      pageTitle: "Chi tiết bài viết",
      article: article,
    })

  } catch (error) {
    req.flash("error", "Không tìm thấy bài viết");
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  }
}

//[GET] /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const article = await Article.findOne({
      _id: req.params.id,
      deleted: false
    })

    const articlesCategory = await ArticleCategory.find({
      deleted: false
    })

    const articleCategoryTree = treeHelper.createTree(articlesCategory);

    res.render("admin/pages/article/edit.pug", {
      pageTitle: "Chỉnh sửa bài viết",
      article: article,
      articlesCategory: articleCategoryTree
    })
  } catch (error) {
    req.flash("error", "Không tìm thấy bài viết");
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  }
}

//[PATCH] /admin/articles/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    const updatedBy = {
      account_id: res.locals.accountUser.id,
      updatedAt: new Date()
    }
    await Article.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy }
      });
    req.flash("success", "Cập nhật bài viết thành công");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật bài viết thất bại");
  }
  res.redirect("back");
}

//[DELETE] /admin/articles/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Article.updateOne({ _id: id }, {
      deleted: true,
      deletedBy: {
        account_id: res.locals.accountUser.id,
        deletedAt: new Date()
      }
    });
    req.flash("success", "Xóa bài viết thành công");
  } catch (error) {
    req.flash("error", "Xóa bài viết thất bại");
  }
  res.redirect("back");
}

//[PATCH] /admin/articles/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updateBy = {
      account_id: res.locals.accountUser.id,
      updatedAt: new Date()
    }
    switch (type) {
      case "active":
        await Article.updateMany({ _id: { $in: ids } }, { status: "active", updateBy: updateBy });
        req.flash("success", "Chuyển trạng thái bài viết sang active thành công");
        break;
      case "inactive":
        await Article.updateMany({ _id: { $in: ids } }, { status: "inactive", updateBy: updateBy });
        req.flash("success", "Chuyển trạng thái bài viết sang inactive thành công");
        break;
      case "delete-all":
        await Article.updateMany({ _id: { $in: ids } }, {
          deleted: true,
          deletedBy: {
            account_id: res.locals.accountUser.id,
            deletedAt: new Date()
          }
        });
        req.flash("success", "Xoá bài viết thành công");
        break;
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Thực hiện thay đổi thất bại");
  }
  res.redirect("back");
}