require("../src/db/mongoose");

const Task = require("../src/models/task");

const task = new Task({ description: "New Task" });

const dropCollectionIfExists = (model) =>
  model
    .exists()
    .then((exists) => {
      if (exists) {
        return model.collection.drop();
      } else {
        return;
      }
    })
    .catch((e) => console.log(e));

const deleteTaskAndCount = async (id) => {
  await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

Task.exists()
  .then(() => dropCollectionIfExists(Task))
  .then(() => task.save())
  .then(() => Task.findOne({}))
  .then(({ _id: id }) => deleteTaskAndCount(id, 2))
  .then((result) => console.log(result))
  .catch((e) => console.log(e));
