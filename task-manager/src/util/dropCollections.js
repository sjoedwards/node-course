// Drop all collections if running in development mode
const User = require("../models/user");
const Task = require("../models/task");
const dropCollectionIfExists = require("../util/dropCollectionIfExists");
const mongoose = require("mongoose");

(async () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    await dropCollectionIfExists(User);
    await dropCollectionIfExists(Task);
    await mongoose.connection.close();
  }
})();
