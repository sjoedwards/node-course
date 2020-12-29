const request = require("supertest");

const Task = require("../src/models/task");
const app = require("../src/app");
const User = require("../src/models/user");
jest.mock("@sendgrid/mail");
const { userOne, userTwo, taskOne, setupDatabase } = require("./fixtures/db");

beforeEach(async () => {
  await setupDatabase();
});

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ description: "From my test" })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test("Should return all tasks for user one", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("User should fail to delete a task that they are not the owner for", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
