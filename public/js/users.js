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

//Hàm xóa lời mời kết bạn
const refuseFriend = (button) => {
  button.addEventListener("click", (e) => {
    button.closest(".box-user").classList.add("refuse");
    const userId = button.getAttribute("btn-refuse-friend");
    socket.emit("CLIENT_REFUSE_FRIEND", userId);
  })
}
//End hàm xóa lời mời kết bạn

//Xóa lời mời kết bạn
const btnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (btnRefuseFriend.length > 0) {
  for (const button of btnRefuseFriend) {
    refuseFriend(button);
  }
}
//End xóa lời mời kết bạn

//Hàm chấp nhận lời mời kết bạn
const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("accepted");
    const userId = button.getAttribute("btn-accept-friend");
    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
  })
}
//End hàm chấp nhận lời mời kết bạn

//Chấp nhận lời mời kết bạn
const btnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (btnAcceptFriend.length) {
  for (const button of btnAcceptFriend) {
    acceptFriend(button);
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

//A gửi lời mời cập nhật thông tin A vào danh sách accept của B
const dataUsersAccept = document.querySelector("[data-users-accept]");
if (dataUsersAccept) {
  socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    const user = data.userA;
    const div = document.createElement("div");
    div.classList.add("col-6");

    div.innerHTML = `
    <div class="box-user">
      <div class='inner-avatar'>
        <img src="${user.avatar}"?"${user.avatar}":"images/th.jpg" alt=${user.fullName}>
      </div>
      <div class="inner-info">
        <div class="inner-name">${user.fullName}</div>
        <div class="inner-buttons">
          <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=user.id> Chấp nhận </button>
          <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=user.id> Xóa </button>
          <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend=user.id disabled> Đã xóa </button>
          <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend disabled> Đã chấp nhận </button>
        </div>
      </div>
    </div>
  `
    const userId = dataUsersAccept.getAttribute("data-users-accept");

    if (userId == data.userId) {
      console.log("test");
      dataUsersAccept.appendChild(div);
    }

    const btnRefuseFriend = div.querySelector("[btn-refuse-friend]");
    refuseFriend(btnRefuseFriend);
    const btnAcceptFriend = div.querySelector("[btn-accept-friend]");
    acceptFriend(btnAcceptFriend);
  })
}