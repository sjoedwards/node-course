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

app.get("/users/:id", async (req, res) => {
  const { id: _id } = req.params;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return handleError(res, "user not found ", 404, `Can't get user ${_id}`);
    }
    return res.send(user);
  } catch (e) {
    return handleError(res, e, 500, `Can't get user ${_id}`);
  }
});

app.get("/users", async (_, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (e) {
    handleError(res, e, 500, "Can't get users");
  }
});

app.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201);
    return res.send(user);
  } catch (e) {
    return handleError(res, e, 400, "Error creating user");
  }
});

app.patch("/users/:id", async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const update = Object.keys(req.body);

  const isValidOperation = update.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    return handleError(res, e, 400, "Error updating user");
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.send(user);
  } catch (e) {
    return handleError(res, e, 400, "Error deleting user");
  }
});

// Tasks APIS

app.get("/tasks/:id", async (req, res) => {
  const { id: _id } = req.params;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return handleError(res, "task not found ", 404, `Can't get task ${_id}`);
    }
    return res.send(task);
  } catch (e) {
    handleError(res, e, 500, `Can't get task ${_id}`);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    return res.send(tasks);
  } catch (e) {
    return handleError(res, e, 500, "Can't get tasks");
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    return res.status(201).send(task);
  } catch (e) {
    return handleError(res, e, 400, "Error creating task");
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const allowedUpdates = Object.keys(Task.schema.obj);

  const update = Object.keys(req.body);

  const isValidOperation = update.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update" });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.send(task);
  } catch (e) {
    return handleError(res, e, 400, "Error updating task");
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    return res.send(task);
  } catch (e) {
    return handleError(res, e, 400, "Error deleting task");
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
