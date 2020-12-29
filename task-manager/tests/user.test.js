const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");
jest.mock("@sendgrid/mail");

const userOneId = mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "Mike@example.com",
  password: "56What!!!",
  tokens: [
    { token: jwt.sign({ _id: userOneId }, process.env.USER_SIGNING_SECRET) },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({ name: "Sam", email: "sam@example.com", password: "MyPass7771!" })
    .expect(201);

  // Assert the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response - contains the name
  expect(response.body.user.name).toBe("Sam");

  // Or can match a whole object
  expect(response.body).toMatchObject({
    user: {
      name: "Sam",
      email: "sam@example.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("MyPass7771!");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(response.body).toMatchObject({
    user: {
      name: userOne.name,
      email: userOne.email.toLowerCase(),
    },
    token: user.tokens[1].token,
  });
});

test("Should not login non existing user", async () =>
  request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "not my password!",
    })
    .expect(401));

test("Should get profile for user", async () =>
  request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200));

test("Should not get profile for unauthenticated user", async () =>
  request(app).get("/users/me").expect(401));

test("Should delete account for user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(response.body._id);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () =>
  request(app).delete("/users/me").send().expect(401));

test("Should upload avatar image", async () => {
  const result = await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  const result = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Jeff",
    })
    .expect(200);

  const user = await User.findById(result.body._id);
  expect(user.name).toEqual("Jeff");
});

test("Should not update invalid user fields", async () => {
  const result = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "area51",
    })
    .expect(400);
});
