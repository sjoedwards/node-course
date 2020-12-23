const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }

    const db = client.db(databaseName);

    // db.collection("users").findOne(
    //   { _id: new ObjectID("5fe3589ed2719b456d014b2e") },
    //   (error, user) => {
    //     if (error) {
    //       return console.log("Unable to fetch");
    //     }

    //     console.log("user", user);
    //   }
    // );

    // db.collection("users")
    //   .find({ age: 27 })
    //   .count((error, users) => {
    //     console.log(users);
    //   });

    db.collection("tasks").insertOne({
      description: "test1",
      completed: false,
    });

    db.collection("tasks")
      .find({ completed: false })
      .toArray((error, tasks) => {
        console.log(error);
        console.log(tasks);
      });
  }
);
