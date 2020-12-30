const socket = window.io();

// Callback arguments are the second arguments from emit
socket.on("message", (message) => {
  console.log(message);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;

  // The third argument is the callback from the server letting us know it was delivered
  socket.emit("sendMessage", message, (error) => {
    if (error) {
      return console.log(error);
    } else {
      return console.log("The message was delivered!", message);
    }
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geolocation is not supported by your browser");
  }

  const getLocation = new Promise((resolve, reject) => {
    console.log("Getting coordinates...");
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => reject("Could not find location")
    );
  });

  getLocation
    .then(({ coords }) => {
      const { latitude, longitude } = coords;
      console.log("Sending coordinates to server...");
      return socket.emit("sendLocation", { latitude, longitude }, () => {
        console.log("Location received by server");
      });
    })
    .catch((e) => console.log(e));
});
