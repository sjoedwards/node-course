const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_CONNECTION_STRING ||
    "mongodb://127.0.0.1:27017/task-manager-api",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);
