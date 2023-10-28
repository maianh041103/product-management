const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

//[GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user._id;
  const fullName = res.locals.user.fullName;

  //socket.io
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        user_id: userId,
        content: content
      });
      await chat.save();

      //Trả data về
      const data = {
        user_id: userId,
        fullName: fullName,
        content: content
      }
      _io.emit("SERVER_RETURN_MESSAGE", data);
    })

    //send typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      const userInfo = {
        userId: userId,
        fullName: fullName,
        type: type
      }
      socket.broadcast.emit("SERVER_RETURN_TYPING", userInfo)
    })

  })
  //end socket.io


  const chats = await Chat.find({
    deleted: false
  })

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName");
    chat.infoUser = infoUser;
  }

  res.render('client/pages/chat/index.pug', {
    pageTitle: "Chat",
    chats: chats
  })
}