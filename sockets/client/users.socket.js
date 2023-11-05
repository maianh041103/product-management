const User = require("../../models/user.model");

module.exports = async (res) => {
  _io.once("connection", async (socket) => {
    const myUserId = res.locals.user.id;

    //A gửi lời mời kết bạn cho B
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      // myUserId : Id cua A
      // userId : Id cua B
      //Thêm B vào requestFriends của A
      const existIdBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId
      })

      if (!existIdBinA) {
        await User.updateOne({
          _id: myUserId
        }, {
          $push: { requestFriends: userId }
        })
      }

      //Thêm A vào acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId
      });

      if (!existIdAinB) {
        await User.updateOne({
          _id: userId
        }, {
          $push: { acceptFriends: myUserId }
        });
      }
    })


    //A hủy gửi yêu cầu kết bạn với B
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      //userId : Id của B
      //myUserId : Id của A
      //Xóa id của B trong request của A
      const existIdBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId
      });

      if (existIdBinA) {
        await User.updateOne({
          _id: myUserId,
        }, {
          $pull: { requestFriends: userId }
        })
      }
      //Xóa id của A trong accept của B
      const existIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId
      });

      if (existIdAinB) {
        await User.updateOne({
          _id: userId,
        }, {
          $pull: { acceptFriends: myUserId }
        })
      }
    })
    //End A hủy gửi yêu cầu kết bạn với B

    //B xóa lời mời kết bạn của A
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      //userId : Id của A
      //myUserId : Id của B
      //Xóa id của A trong acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId
      });

      if (existIdAinB) {
        await User.updateOne({
          _id: myUserId
        }, {
          $pull: {
            acceptFriends: userId
          }
        })
      }
      //Xóa id của B trong requestFriends của A
      const existIdBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId
      });

      if (existIdBinA) {
        await User.updateOne({
          _id: userId
        }, {
          $pull: {
            requestFriends: myUserId
          }
        })
      }
    })

  })
}