const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const handleError = require("../util/handleError");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

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

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    return res.send();
  } catch (e) {
    return handleError(res, e, 500, "Failed to logout");
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const update = Object.keys(req.body);

  const isValidOperation = update.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update" });
  }

  try {
    const { user } = req;

    update.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    res.send(user);
  } catch (e) {
    return handleError(res, e, 400, "Error updating user");
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();

    return res.send(req.user);
  } catch (e) {
    return handleError(res, e, 400, "Error deleting user");
  }
});

// File uploading uses the multer library
const upload = multer({
  // Below dest means that the file will be saved to the filesystem - we don't want to do this
  // dest: "avatars",
  limits: {
    // Must be less than 1mb
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    // Must be an image
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error("Please upload an image"));
    }

    callback(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  [auth, upload.single("avatar")],
  async (req, res) => {
    //Sharp returns promises, so await is required
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    return res.send();
  },
  // Needs to have this exact set of arguments, even if unused, to let express know its middleware - its a bit silly
  // eslint-disable-next-line no-unused-vars
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    return res.send();
  } catch (e) {
    return handleError(res, e, 400, "Error deleting avatar");
  }
});

router.get("/users/me/avatar", auth, async (req, res) => {
  if (!req.user || !req.user.avatar) {
    return handleError(res, undefined, 404, "No user or avatar defined");
  }

  try {
    // Send back content type - converts Buffer to an image
    res.set("Content-Type", "image/png");
    res.send(req.user.avatar);
  } catch (e) {
    return handleError(res, e, 400);
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      return handleError(res, undefined, 404, "No user or avatar defined");
    }

    // Send back content type - converts Buffer to an image
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    return handleError(res, e, 400);
  }
});

// Example of getting user by id, could convert so that only admin type can do this?

// router.patch("/users/:id", auth, async (req, res) => {
//   const allowedUpdates = ["name", "email", "password", "age"];
//   const update = Object.keys(req.body);

//   const isValidOperation = update.every((update) =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid Update" });
//   }

//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     update.forEach((update) => {
//       user[update] = req.body[update];
//     });

//     await user.save();

//     res.send(user);
//   } catch (e) {
//     return handleError(res, e, 400, "Error updating user");
//   }
// });

// Example of deleting user by id, could convert so that only admin type can do this?

// router.delete("/users/:id", auth, async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     return res.send(user);
//   } catch (e) {
//     return handleError(res, e, 400, "Error deleting user");
//   }
// });

module.exports = router;
