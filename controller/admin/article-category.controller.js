const ArticleCategory = require('../../models/article-category.model');
const Account = require('../../models/account.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const treeHelper = require('../../helpers/createTree');
const systemConfig = require('../../config/system');

//[GET] /admin/article-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }

  const filterStatus = filterStatusHelper(req.query);

  const objectSearch = searchHelper(req.query);
  if (objectSearch.keyword) {
    find.title = objectSearch.regex;
  }

  const status = req.query.status;
  if (status) {
    find.status = status;
  }

  const articlesCategory = await ArticleCategory.find(find);


  for (const articleCategory of articlesCategory) {
    // CreatedBy
    if (articleCategory.createdBy.account_id) {
      const accountUser = await Account.findOne({ _id: articleCategory.createdBy.account_id })
      if (accountUser) {
        articleCategory.fullName = accountUser.fullName;
      }
    }
    //UpdatedAt
    if (articleCategory.updatedBy.length > 0) {
      for (let i = 0; i < articleCategory.updatedBy.length; i++) {
        const accountUpdate = await Account.findOne(
          { _id: articleCategory.updatedBy[i].account_id });
        if (accountUpdate) {
          articleCategory.updatedBy[i].fullName = accountUpdate.fullName;
        }
      }
    }
  }

  const articleCategoryTree = treeHelper.createTree(articlesCategory);
  res.render('admin/pages/article-category/index', {
    pageTitle: "Danh mục bài viết",
    articlesCategory: articleCategoryTree,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword
  });
}

//[GET] /admin/article-category/create
module.exports.create = async (req, res) => {
  const articlesCategory = await ArticleCategory.find({
    deleted: false
  });
  const articlesCategoryTree = treeHelper.createTree(articlesCategory);
  res.render('admin/pages/article-category/create.pug', {
    pageTitle: "Tạo danh mục bài viết",
    articlesCategory: articlesCategoryTree
  });
}

//[POST] /admin/article-category/create
module.exports.createPOST = async (req, res) => {
  try {
    req.body.createdBy = {
      account_id: res.locals.accountUser._id
    }
    const articleCategory = await new ArticleCategory(req.body);
    articleCategory.save();
    req.flash("success", "Tạo mới danh mục bài viết thành công");
  } catch (error) {
    req.flash("error", "Tạo mới danh mục bài viết thất bại");
  }
  res.redirect(`${systemConfig.prefixAdmin}/article-category`);
}

//[PATCH] /admin/article-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const updatedBy = {
      account_id: res.locals.accountUser._id,
      updatedAt: new Date()
    }
    await ArticleCategory.updateOne(
      { _id: req.params.id },
      {
        status: req.params.status,
        $push: {
          updatedBy: updatedBy
        }
      });
    req.flash("success", "Cập nhật trạng thái danh mục bài viết thành công");
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái danh mục bài viết thất bại")
  }
  res.redirect("back");
}

//[GET] /admin/article-category/edit/:id
module.exports.edit = async (req, res) => {
  const articleCategory = await ArticleCategory.findOne({ _id: req.params.id });
  const articlesCategory = await ArticleCategory.find({ deleted: false });
  const articlesCategoryTree = treeHelper.createTree(articlesCategory);
  res.render('admin/pages/article-category/edit.pug', {
    pageTitle: "Chỉnh sửa danh mục bài viết",
    articleCategory: articleCategory,
    articlesCategory: articlesCategoryTree
  })
}

//[PATCH] /admin/article-category/edit/:id
module.exports.editPATCH = async (req, res) => {
  try {
    const updatedBy = {
      account_id: res.locals.accountUser._id,
      updatedAt: new Date()
    }
    await ArticleCategory.updateOne({ _id: req.params.id }, { ...req.body, $push: { updatedBy: updatedBy } });
    req.flash("success", "Cập nhật thông tin danh mục bài viết thành công");
  } catch (error) {
    req.flash("error", "Cập nhật thông tin danh mục bài viết thất bại");
  }
  res.redirect("back");
}

//[GET] /admin/article-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const articleCategory = await ArticleCategory.findOne({
      _id: req.params.id,
      deleted: false
    })

    if (articleCategory.parent_id) {
      const articleCategoryParent = await ArticleCategory.findOne({ _id: articleCategory.parent_id });
      articleCategory.parent_title = articleCategoryParent.title;
    }

    res.render('admin/pages/article-category/detail', {
      pageTitle: "Chi tiết danh mục bài viết",
      articleCategory: articleCategory
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/article-category`);
  }
}

//[DELETE] /admin/article-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    await ArticleCategory.updateOne(
      { _id: req.params.id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.accountUser.id,
          deletedAt: new Date()
        }
      })
    req.flash("success", "Xóa 1 danh mục thành công");
  } catch (error) {
    req.flash("error", "Xóa 1 danh mục thất bại");
  }
  res.redirect('back');
}

//[PATCH] /admin/article-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(',');
  const updatedBy = {
    account_id: res.locals.accountUser.id,
    updatedAt: new Date()
  }
  if (type && ids) {
    switch (type) {
      case "active":
        await ArticleCategory.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });
        req.flash("Cập nhật trạng thái danh mục bài viết sang active thành công");
        break;
      case "inactive":
        await ArticleCategory.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } });
        req.flash("Cập nhật trạng thái danh mục bài viết sang inactive thành công");
        break;
      case "delete-all":
        await ArticleCategory.updateMany({ _id: { $in: ids } }, { deleted: true, $push: { updatedBy: updatedBy } });
        req.flash("Xóa danh mục bài viết thành công");
        break;
      default:
        alert("Vui lòng chọn ít nhất 1 tiêu chí");
    }
  }
  res.redirect("back");
}