const express = require("express");

// Load env
require("./env");

// Start database connection
require("./db/mongoose");

// Require routes
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

// Body parsing middleware
app.use(express.json());

// Register routes
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
