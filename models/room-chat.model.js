const mongoose = requirea('momgoose');

const roomChatSchema = new mongoose.Scheme({
  title: String,
  avatar: String,
  typeRoom: String,
  status: String,
  users: [{
    user_id: String,
    role: String
  }],
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestams: true
})

const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;