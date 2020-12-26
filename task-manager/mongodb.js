// This file is not used, but is useful for knowing how to interface directly with MongoDB

const { MongoClient } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

const collectionExists = (collection) =>
  collection
    .find({})
    .toArray()
    .then((result) => result.length > 0);

const dropCollectionIfExists = (collection) =>
  collectionExists(collection)
    .then((exists) => {
      if (exists) {
        return collection.drop();
      } else {
        return;
      }
    })
    .catch((e) => {
      throw new Error(e);
    });

let users;
let tasks;
MongoClient.connect(connectionURL, { useNewUrlParser: true })
  .then((client) => {
    const db = client.db(databaseName);
    users = db.collection("users");
    tasks = db.collection("tasks");
    return;
  })
  .then(() => dropCollectionIfExists(users))
  .then(() => users.insertOne({ name: "Jim", age: 25 }))
  .then(({ ops }) => {
    const { _id } = ops[0];
    return users.updateOne({ _id }, { $set: { name: "Jimbo" } });
  })
  .then(() => {
    return console.log("Success!");
  })
  .catch((e) => console.log(`Couldn't update user: ${e}`))
  .then(() => dropCollectionIfExists(tasks))
  .then(() =>
    tasks.insertMany([
      { description: "Clean the house", completed: true },
      { description: "Renew inpection", completed: false },
      { description: "Pot plants", completed: false },
    ])
  )
  .then(() =>
    tasks.updateMany({ completed: false }, { $set: { completed: true } })
  )
  .then(() => tasks.findOne({}))
  .then(({ description }) => tasks.deleteOne({ description }))
  .catch((e) => console.log("Couldn't update tasks", e));

(async () => {
  try {
    const client = await MongoClient.connect(connectionURL, {
      useNewUrlParser: true,
    });
    const db = client.db(databaseName);
    const users = db.collection("usersAsync");
    await dropCollectionIfExists(users);
    const { ops } = await users.insertOne({ name: "Jim", age: 25 });
    const { _id } = ops[0];
    await users.updateOne({ _id }, { $set: { name: "JimboAsync" } });
    console.log("Success");
  } catch (e) {
    throw new Error(`Unable to update users ${e}`);
  }
})();
