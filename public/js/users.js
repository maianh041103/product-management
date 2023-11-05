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