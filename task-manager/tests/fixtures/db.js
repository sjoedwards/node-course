const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = mongoose.Types.ObjectId();
const userTwoId = mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "Mike@example.com",
  password: "56What!!!",
  tokens: [
    { token: jwt.sign({ _id: userOneId }, process.env.USER_SIGNING_SECRET) },
  ],
};

const userTwo = {
  _id: userTwoId,
  name: "Mike1",
  email: "Mike1@example.com",
  password: "561What!!!",
  tokens: [
    { token: jwt.sign({ _id: userTwoId }, process.env.USER_SIGNING_SECRET) },
  ],
};

const taskOne = {
  _id: mongoose.Types.ObjectId(),
  description: "First Task",
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: mongoose.Types.ObjectId(),
  description: "Second Task",
  completed: true,
  owner: userOne._id,
};

const taskThree = {
  _id: mongoose.Types.ObjectId(),
  description: "Third Task",
  completed: true,
  owner: userTwo._id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();

  return;
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  taskOne,
  setupDatabase,
};
