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