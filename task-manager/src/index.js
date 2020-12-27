const express = require("express");
require("dotenv/config");

// Start database connection
require("./db/mongoose");

const app = express();

// Body parsing middleware
app.use(express.json());

// Register routes
const userRouter = require("./routers/user");
app.use(userRouter);
const taskRouter = require("./routers/task");
app.use(taskRouter);

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
