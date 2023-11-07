const User = require('../../models/user.model');
const socketUsers = require('../../sockets/client/users.socket');

//[GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;

  const friendListId = res.locals.user.friendList.map(item => {
    return item.user_id;
  })

  socketUsers(res);
  const user = await User.findOne({
    _id: userId
  });

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: user.requestFriends } },
      { _id: { $nin: user.acceptFriends } },
      { _id: { $nin: friendListId } },
    ],
    deleted: false,
    status: "active"
  });

  res.render("client/pages/users/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    users: users
  })
}

//[GET] /users/request
module.exports.requestFriend = async (req, res) => {
  socketUsers(res);

  const userId = res.locals.user.id;

  const users = await User.find({
    _id: { $in: res.locals.user.requestFriends },
    deleted: false,
    status: "active"
  }).select("id fullName avatar");

  res.render("client/pages/users/request-friend", {
    pageTitle: "Lời mời đã gửi",
    users: users
  })
}

//[GET] /users/accept
module.exports.acceptFriend = async (req, res) => {
  socketUsers(res);
  const userId = res.locals.user.id;

  const users = await User.find({
    _id: { $in: res.locals.user.acceptFriends },
    deleted: false,
    status: "active"
  })

  res.render("client/pages/users/accept-friend", {
    pageTitle: "Lời mời đã nhận",
    users: users
  })
}

//[GET] /users/friends
module.exports.friends = async (req, res) => {
  const friendListId = res.locals.user.friendList.map(item => {
    return item.user_id;
  })
  const users = await User.find({
    _id: { $in: friendListId },
    status: "active",
    deleted: false
  });
  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users
  })
}