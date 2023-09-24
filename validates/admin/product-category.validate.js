module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề");
        res.redirect('back');
        return;
    }
    next(); // Nếu thỏa mãn điều kiện chạy sang cái tiếp theo
}