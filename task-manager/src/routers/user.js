const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const handleError = require("../util/handleError");

router.get("/users/:id", async (req, res) => {
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

router.get("/users", async (_, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (e) {
    handleError(res, e, 500, "Can't get users");
  }
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201);
    return res.send(user);
  } catch (e) {
    return handleError(res, e, 400, "Error creating user");
  }
});

router.patch("/users/:id", async (req, res) => {
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

router.delete("/users/:id", async (req, res) => {
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
module.exports = router;
