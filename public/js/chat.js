import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

//Chat cơ bản
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  const input = formSendData.querySelector("[name='content']");
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = input.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      input.value = "";
    }
  })
}
//End Chat cơ bản

//Socket.io
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const myId = document.querySelector("[my-id]");
  const userId = myId.getAttribute('my-id');
  const div = document.createElement("div");
  let userName = "";
  if (userId == data.user_id) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    userName = `<div class="inner-name">${data.fullName}</div>`;
  }
  div.innerHTML = `${userName}
  <div class="inner-content">${data.content}</div>
  `;
  body.appendChild(div);

  bodyChat.scrollTop = bodyChat.scrollHeight;
})
//End Socket.io

//Scoll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
//End Scoll chat to bottom

//Icon
const buttonIcon = document.querySelector(".button-icon");
const toolTip = document.querySelector(".tooltip");
if (buttonIcon) {
  Popper.createPopper(buttonIcon, toolTip);
  buttonIcon.addEventListener("click", () => {
    toolTip.classList.toggle("shown");
  })
}

const icon = document.querySelector("emoji-picker");
if (icon) {
  icon.addEventListener("emoji-click", (e) => {
    const iconValue = e.detail.unicode;
    const input = formSendData.querySelector("[name='content']");
    input.value = input.value + iconValue;
  })
}
//End Icon

//Typing
const input = formSendData.querySelector("[name='content']");
if (input) {
  input.addEventListener("keyup", (e) => {
    socket.emit("CLIENT_SEND_TYPING", "show");
  })
}

socket.on("SERVER_RETURN_TYPING", (user) => {
  console.log(user);
})
//End Typing