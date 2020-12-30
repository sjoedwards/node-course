const socket = window.io();

// Callback arguments are the second arguments from emit
socket.on("welcome", (message) => {
  console.log(`${message}`);
});

socket.on("newMessage", (message) => {
  console.log(`${message}`);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message);
});
