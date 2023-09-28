//[GET] /admin/role
module.exports.index = async (req, res) => {
    res.render('admin/pages/role/index.pug', {
        pageTitle: "Trang phân quyền"
    })
}