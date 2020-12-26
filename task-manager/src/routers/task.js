const express = require("express");
const Task = require("../models/task");
const router = new express.Router();
const handleError = require("../util/handleError");

router.get("/tasks/:id", async (req, res) => {
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

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    return res.send(tasks);
  } catch (e) {
    return handleError(res, e, 500, "Can't get tasks");
  }
});

router.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    return res.status(201).send(task);
  } catch (e) {
    return handleError(res, e, 400, "Error creating task");
  }
});

router.patch("/tasks/:id", async (req, res) => {
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

router.delete("/tasks/:id", async (req, res) => {
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

module.exports = router;
