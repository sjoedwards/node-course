require("../src/db/mongoose");

const User = require("../src/models/user");

// .then must return a promise or throw an exception
User.exists()
  .then((exists) => {
    if (exists) {
      return User.collection.drop();
    } else {
      return;
    }
  })
  .then(() => {
    const user = new User({
      name: "New",
      email: "new@new.com",
      password: "usernames123",
    });
    return user.save();
  })
  .then(() => User.findOne({}))
  .then(({ _id }) => {
    return User.findByIdAndUpdate(_id, { age: 2 });
  })
  .then(() => User.countDocuments({ age: 2 }))
  .then((result) => console.log(result))
  .catch((e) => console.log(e));
