const express = require("express");
const Task = require("../models/task");
const router = new express.Router();
const handleError = require("../util/handleError");
const auth = require("../middleware/auth");

router.get("/tasks/:id", auth, async (req, res) => {
  const { id: _id } = req.params;
  try {
    // Only return the task if the requestor owns it
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return handleError(res, "task not found ", 404, `Can't get task ${_id}`);
    }
    return res.send(task);
  } catch (e) {
    handleError(res, e, 500, `Can't get task ${_id}`);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    // Only return the task if the requestor owns it
    const tasks = await Task.find({ owner: req.user._id });
    // Get the virtual field, mapping user._id to task.owner, see user.js
    await req.user.populate("tasks");
    return res.send(tasks);
  } catch (e) {
    return handleError(res, e, 500, "Can't get tasks");
  }
});

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });

    await task.save();
    return res.status(201).send(task);
  } catch (e) {
    return handleError(res, e, 400, "Error creating task");
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const allowedUpdates = Object.keys(Task.schema.obj);

  const update = Object.keys(req.body);

  const isValidOperation = update.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    update.forEach((update) => (task[update] = req.body[update]));

    await task.save();

    res.send(task);
  } catch (e) {
    return handleError(res, e, 400, "Error updating task");
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    return res.send(task);
  } catch (e) {
    return handleError(res, e, 500, "Error deleting task");
  }
});

module.exports = router;
