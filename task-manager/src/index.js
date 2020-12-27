const express = require("express");

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

const bcrypt = require("bcryptjs");

const myFunction = async () => {
  const password = "Red12345!";
  const hashedPassword = await bcrypt.hash(password, 8);
  console.log(
    "🚀 ~ file: index.js ~ line 28 ~ myFunction ~ hashedPassword",
    hashedPassword
  );

  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log("🚀 ~ file: index.js ~ line 34 ~ myFunction ~ isMatch", isMatch);
};

myFunction();
