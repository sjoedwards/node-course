const mongoose = require("mongoose");
const User = require("../models/user");
const Task = require("../models/task");
const dropCollectionIfExists = require("../util/dropCollectionIfExists");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Drop all collections if running in development mode
(async () => {
  if (process.env.NODE_ENV !== "production") {
    await dropCollectionIfExists(User);
    await dropCollectionIfExists(Task);
  }
})();
