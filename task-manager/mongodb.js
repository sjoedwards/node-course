const { MongoClient } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true })
  .then((client) => {
    const db = client.db(databaseName);
    const users = db.collection("users");
    const collectionExists = (collection) =>
      collection
        .find({})
        .toArray()
        .then((result) => result.length > 0);

    const dropCollectionIfExists = (collection) =>
      new Promise((resolve) => {
        collectionExists(collection).then((exists) => {
          if (exists) {
            collection.drop().then(() => {
              resolve();
            });
          } else {
            resolve();
          }
        });
      });

    dropCollectionIfExists(users).then(
      users
        .insertOne({ name: "Jim", age: 25 })
        .then(({ ops }) => {
          const { _id } = ops[0];
          users
            .updateOne({ _id }, { $set: { name: "Jimbo" } })
            .then(() => {
              console.log("Success!");
            })
            .catch((e) => console.log(`Couldn't update user: ${e}`));
        })
        .catch(() => console.log("Couldn't insert user"))
    );

    const tasks = db.collection("tasks");

    dropCollectionIfExists(tasks).then(() =>
      tasks
        .insertMany([
          { description: "Clean the house", completed: true },
          { description: "Renew inpection", completed: false },
          { description: "Pot plants", completed: false },
        ])
        .then(() => {
          tasks
            .updateMany({ completed: false }, { $set: { completed: true } })
            .then(() => {
              tasks.findOne({}).then(({ description }) => {
                tasks.deleteOne({ description: "Clean the house" });
              });
            })
            .catch((e) => console.log("Couldn't update tasks", e));
        })
        .catch((e) => console.log("Couldn't insert tasks", e))
    );
  })
  .catch(() => console.log("Unable to connect to database"));
