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

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

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

  socket.on("join", ({ username, room }, callback) => {
    console.log(`${username} joined ${room}`);
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    //A room is a subset of clients
    //socket.emit - just sends to current user
    //io.emit - emits to all clients
    //io.to().emit - emits event to everyone in a room
    //socket.broadcast.emit - sends to everyone but the current user
    //socket.broadcast.to().emit - sends to everyone but the current user in a certain room
    socket.join(user.room);
    socket.emit(
      "message",
      generateMessage(`Welcome ${user.username}`, "Admin")
    );
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${username} has joined`, "Admin"));
    callback();

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (filter.isProfane(message)) {
      // Sends an error back to the client
      return callback("Profanity is not allowed");
    }
    // io.emit will emit to all clients
    io.to(user.room).emit("message", generateMessage(message, user.username));

    // Sends confirmation back to the client
    callback();
  });

  socket.on("sendLocation", (location, callback) => {
    const user = getUser(socket.id);
    socket.broadcast
      .to(user.room)
      .emit(
        "locationMessage",
        generateLocationMessage(location, user.username)
      );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      // Don't need to broadcast because client has already been disconnected
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} left the room`, "Admin")
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
