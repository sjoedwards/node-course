const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const path = require("path");
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

  //Socket.emit will emit only to a single connection
  socket.emit("message", "Welcome!");

  // Broadcast sends to every connection aside from the current one
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (message) => {
    // io.emit will emit to all clients
    io.emit("message", message);
    console.log(`New message:${message}`);
  });

  socket.on("disconnect", () => {
    // Don't need to broadcast because client has already been disconnected
    io.emit("message", "user left");
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
