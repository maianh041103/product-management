//Gửi lời mời kết bạn
const btnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (btnAddFriend.length > 0) {
  for (const button of btnAddFriend) {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");
      const userId = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND", userId);
    })
  }
}
//End gửi lời mời kết bạn

//Hủy lời mời kết bạn
const btnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (btnCancelFriend.length > 0) {
  for (const button of btnCancelFriend) {
    button.addEventListener("click", (e) => {
      button.closest(".box-user").classList.remove("add");
      const userId = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    })
  }
}
//End hủy lời mời kết bạn

//Xóa lời mời kết bạn
const btnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (btnRefuseFriend.length > 0) {
  for (const button of btnRefuseFriend) {
    button.addEventListener("click", (e) => {
      button.closest(".box-user").classList.add("refuse");
      const userId = button.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    })
  }
}
//End xóa lời mời kết bạn

//Chấp nhận lời mời kết bạn
const btnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (btnAcceptFriend.length) {
  for (const button of btnAcceptFriend) {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");
      const userId = button.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    })
  }
}
//End chấp nhận lời mời kết bạn

//A gửi lời mời cập nhật số lượng lời mời bên B
const badgeUsersAccept = document.querySelector("[badge-users-accept]");
if (badgeUsersAccept) {
  socket.on("SERVER_RETURN_ACCEPT_LENGTH", (data) => {
    if (badgeUsersAccept.getAttribute("badge-users-accept") == data.userId) {
      badgeUsersAccept.innerHTML = parseInt(data.acceptFriendLength);
    }
  })
}
//End A gửi lời mời cập nhật số lượng lời mời bên B