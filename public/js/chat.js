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