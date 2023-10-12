

//[GET] /admin/article-category
module.exports.index = (req, res) => {
  res.render('admin/pages/article-category/index', {
    pageTitle: "Danh mục bài viết"
  });
}