const RoomChat = require('../../models/room-chat.model');

module.exports.roomChat = async (req, res, next) => {
  const roomChatId = req.params.roomId;
  if (roomChatId) {
    const roomChatExists = await RoomChat.findOne({
      _id: roomChatId,
      "users.user_id": res.locals.user._id,
      deleted: false
    })
    if (roomChatExists) {
      next();
    } else {
      res.redirect('/');
    }
  } else {
    next();
  }
}