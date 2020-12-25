const mongoose = require("mongoose");
const { default: validator } = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Value must be an email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain password");
      }
    },
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be greater than 0");
      }
    },
  },
});

const Task = mongoose.model("Task", {
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const me = new User({
  name: "Sam",
  email: "sam@test.com",
  password: "assword123",
  age: 25,
});

const task = new Task({ description: "Sam" });

User.exists()
  .then((exists) => {
    if (exists) {
      return User.collection.drop();
    } else {
      return;
    }
  })
  .then(() => me.save())
  .catch((e) => console.log(e));

Task.exists()
  .then((exists) => {
    if (exists) {
      return Task.collection.drop();
    } else {
      return;
    }
  })
  .then(() => task.save())
  .then(() => console.log(task))
  .catch((e) => console.log(e));
