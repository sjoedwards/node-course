const socket = window.io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#send-location");

// Callback arguments are the second arguments from emit
socket.on("message", (message) => {
  console.log(message);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;

  // The third argument is the callback from the server letting us know it was delivered
  socket.emit("sendMessage", message, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("The message was delivered!", message);
    }

    // Clear and refocus input
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
  });
});

$locationButton.addEventListener("click", () => {
  $locationButton.setAttribute("disabled", "disabled");

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
        $locationButton.removeAttribute("disabled");
      });
    })
    .catch((e) => console.log(e));
});
