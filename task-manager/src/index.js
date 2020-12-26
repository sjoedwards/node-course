const express = require("express");
require("./db/mongoose");

const app = express();
app.use(express.json());
const User = require("./models/user");
const Task = require("./models/task");

const port = process.env.port || 3000;

const handleError = (
  res,
  error,
  status = 400,
  message = "An unexpected error occured"
) => {
  console.log(`${message}: ${error}`);
  return res.status(status).send(message);
};

app.get("/users/:id", (req, res) => {
  const { id: _id } = req.params;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return handleError(
          res,
          "user not found ",
          404,
          `Can't get user ${_id}`
        );
      }
      return res.send(user);
    })
    .catch((e) => handleError(res, e, 500, `Can't get user ${_id}`));
});

app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      return res.send(users);
    })
    .catch((e) => handleError(res, e, 500, "Can't get users"));
});

app.get("/tasks/:id", (req, res) => {
  const { id: _id } = req.params;
  Task.findById(_id)
    .then((task) => {
      if (!task) {
        return handleError(
          res,
          "task not found ",
          404,
          `Can't get task ${_id}`
        );
      }
      return res.send(task);
    })
    .catch((e) => handleError(res, e, 500, `Can't get task ${_id}`));
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      return res.send(tasks);
    })
    .catch((e) => handleError(res, e, 500, "Can't get tasks"));
});

app.post("/users", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.status(201);
      return res.send(user);
    })
    .catch((e) => {
      return handleError(res, e, 400, "Error creating user");
    });
});

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(() => {
      res.status(201);
      return res.send(task);
    })
    .catch((e) => {
      return handleError(res, e, 400, "Error creating task");
    });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
