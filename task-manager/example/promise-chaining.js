require("../src/db/mongoose");

const User = require("../src/models/user");
const user = new User({
  name: "New",
  email: "new@new.com",
  password: "usernames123",
});

const dropCollectionIfExists = (model) => {
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
};

// .then must return a promise or throw an exception
User.exists()
  .then(() => dropCollectionIfExists(User))
  .then(() => user.save())
  .then(() => User.findOne({}))
  .then(({ _id }) => User.findByIdAndUpdate(_id, { age: 2 }))
  .then(() => User.countDocuments({ age: 2 }))
  .then((result) => console.log(result))
  .catch((e) => console.log(e));
