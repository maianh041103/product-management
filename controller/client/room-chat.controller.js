// [GET]/
module.exports.index = async (req, res) => {
  res.render("client/pages/room-chat/index.pug", {
    pageTitle: "Danh sách phòng chat"
  })
}