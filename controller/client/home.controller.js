//[GET] /

module.exports.index = (req, res) => {
    res.render("client/pages/home/index.pug",
        {
            pageTitle: "Trang chủ"
        }); // mac dinh o trang index.js tro tu thu muc view
}