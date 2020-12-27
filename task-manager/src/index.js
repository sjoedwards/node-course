const express = require("express");
require("dotenv/config");

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

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
