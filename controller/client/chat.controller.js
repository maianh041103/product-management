module.exports.index = async (req, res) => {
  _io.on("connection", (socket) => {
    console.log("user connection " + socket.id);
  })
  res.render('client/pages/chat/index.pug', {
    pageTitle: "Chat"
  })
}