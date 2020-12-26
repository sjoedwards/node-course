require("../src/db/mongoose");

const Task = require("../src/models/task");

// .then must return a promise or throw an exception

Task.exists()
  .then((exists) => {
    if (exists) {
      return Task.collection.drop();
    } else {
      return;
    }
  })
  .then(() => {
    const task = new Task({ description: "New Task" });
    return task.save();
  })
  .then(() => Task.findOne({}))
  .then(({ _id }) => Task.findByIdAndDelete(_id))
  .then(() => Task.countDocuments({ completed: false }))
  .then((result) => console.log(result))
  .catch((e) => console.log(e));
