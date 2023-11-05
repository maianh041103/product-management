const User = require('../../models/user.model');
const socketUsers = require('../../sockets/client/users.socket');

//[GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;

  socketUsers(res);
  const user = await User.findOne({
    _id: userId
  });

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: user.requestFriends } },
      { _id: { $nin: user.acceptFriends } }
    ],
    deleted: false,
    status: "active"
  });

  res.render("client/pages/users/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    users: users
  })
}