const User = require("./src/models/user");
const Task = require("./src/models/task");

// File isn't used, but this is how you would drop a collection if required

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
