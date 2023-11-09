const uploadImagesToClound = require('../../helpers/uploadImagesToClound');
const Chat = require('../../models/chat.model');

module.exports = (req, res) => {
  const userId = res.locals.user._id;
  const fullName = res.locals.user.fullName;
  const roomId = req.params.roomId;

  _io.once("connection", (socket) => {
    socket.join(roomId);
    socket.on("CLIENT_SEND_MESSAGE", async (result) => {
      let images = [];
      for (const image of result.images) {
        const link = await uploadImagesToClound(image);
        images.push(link);
      }

      const chat = new Chat({
        user_id: userId,
        content: result.content,
        images: images,
        room_chat_id: req.params.roomId
      });
      await chat.save();

      //Trả data về
      const data = {
        user_id: userId,
        fullName: fullName,
        content: result.content,
        images: images
      }
      _io.to(roomId).emit("SERVER_RETURN_MESSAGE", data);
    })

    //send typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      const userInfo = {
        userId: userId,
        fullName: fullName,
        type: type
      }
      socket.broadcast.to(roomId).emit("SERVER_RETURN_TYPING", userInfo)
    })
  })
}