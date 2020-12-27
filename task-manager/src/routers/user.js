const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const handleError = require("../util/handleError");
const auth = require("../middleware/auth");

router.get("/users/me", auth, async (req, res) => {
  // Auth middleware adds user to req object
  return res.send(req.user);
});

router.get("/users/:id", auth, async (req, res) => {
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

router.get("/users", auth, async (_, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (e) {
    handleError(res, e, 500, "Can't get users");
  }
});

// Signup
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    res.status(201);
    return res.send({ user, token });
  } catch (e) {
    return handleError(res, e, 400, "Error creating user");
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (e) {
    return handleError(res, e, 401, "Failed to log user in");
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token);
    await req.user.save();
    return res.send();
  } catch (e) {
    return handleError(res, e, 500, "Failed to logout");
  }
});

router.patch("/users/:id", auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const update = Object.keys(req.body);

  const isValidOperation = update.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    update.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    res.send(user);
  } catch (e) {
    return handleError(res, e, 400, "Error updating user");
  }
});

router.delete("/users/:id", auth, async (req, res) => {
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
