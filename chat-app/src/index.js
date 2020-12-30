const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const path = require("path");
const Filter = require("bad-words");
const filter = new Filter();
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

// Express does this behind the scene anyways
const server = http.createServer(app);

// Socketio expects to be called with the raw server
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(path.join(publicDirectoryPath)));

// Form a connection
io.on("connection", (socket) => {
  console.log("New Websocket connection");

  socket.on("join", ({ username, room }) => {
    //A room is a subset of clients
    //socket.emit - just sends to current user
    //io.emit - emits to all clients
    //io.to().emit - emits event to everyone in a room
    //socket.broadcast.emit - sends to everyone but the current user
    //socket.broadcast.to().emit - sends to everyone but the current user in a certain room
    socket.join(room);
    socket.emit("message", generateMessage("Welcome"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined`));
  });

  socket.on("sendMessage", (message, callback) => {
    if (filter.isProfane(message)) {
      // Sends an error back to the client
      return callback("Profanity is not allowed");
    }
    // io.emit will emit to all clients
    io.to("room1").emit("message", generateMessage(message));
    console.log(`New message:${message}`);

    // Sends confirmation back to the client
    callback();
  });

  socket.on("sendLocation", (location, callback) => {
    socket.broadcast.emit("locationMessage", generateLocationMessage(location));
    callback();
  });

  socket.on("disconnect", () => {
    // Don't need to broadcast because client has already been disconnected
    io.to("room1").emit("message", generateMessage("user left"));
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
