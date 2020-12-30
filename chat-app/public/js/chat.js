const socket = window.io();

const autoScroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height of messages containtainer
  const visibleHeight = $messages.offsetHeight;

  // Actual height of messages containtainer
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector(".chat__sidebar");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationButtonTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sideBarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Callback arguments are the second arguments from emit
socket.on("message", ({ text, createdAt, username: user }) => {
  const html = window.Mustache.render(messageTemplate, {
    message: text,
    createdAt: window.moment(createdAt).format("h:mm a"),
    user,
  });

  // Add the html to the div before it ends
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on(
  "locationMessage",
  ({ text: location, createdAt, username: user }) => {
    const html = window.Mustache.render(locationButtonTemplate, {
      location,
      createdAt: window.moment(createdAt).format("h:mm a"),
      user,
    });

    // Add the html to the div before it ends
    $messages.insertAdjacentHTML("beforeend", html);
  }
);

socket.on("roomData", ({ room, users }) => {
  const html = window.Mustache.render(sideBarTemplate, {
    room,
    users,
  });
  $sidebar.innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;

  // The third argument is the callback from the server letting us know it was delivered
  socket.emit("sendMessage", message, (error) => {
    if (error) {
      console.log(error);
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
    .catch((e) => {
      console.log(e);
      $locationButton.removeAttribute("disabled");
    });
});
const query = window.Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username: query.username, room: query.room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
