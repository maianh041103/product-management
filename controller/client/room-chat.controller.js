const RoomChat = require('../../models/room-chat.model');
const User = require('../../models/user.model');

// [GET]/
module.exports.index = async (req, res) => {
  const roomsChat = await RoomChat.find({
    deleted: false,
    typeRoom: "group",
    "users.user_id": res.locals.user.id
  });

  res.render("client/pages/room-chat/index.pug", {
    pageTitle: "Danh sách phòng chat",
    roomsChat: roomsChat
  })
}

//[GET] /create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;

  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id
    });
    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/room-chat/create.pug", {
    pageTitle: "Trang tạo phòng chat",
    friendList: friendList
  })
}

//[POST] /create
module.exports.createPOST = async (req, res) => {
  let users = [];
  for (const userId of req.body.usersId) {
    const user = {
      user_id: userId,
      role: "user"
    }
    users.push(user);
  }
  users.push({
    user_id: res.locals.user.id,
    role: "superAdmin"
  })
  const roomData = {
    title: req.body.title,
    avatar: req.body.avatar,
    typeRoom: "group",
    users: users
  }
  const roomChat = new RoomChat(roomData);
  await roomChat.save();
  res.redirect(`/chat/${roomChat.id}`);
}