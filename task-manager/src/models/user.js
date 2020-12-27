const validator = require("validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Value must be an email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain password");
      }
    },
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be greater than 0");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Add to the instance of the collection i.e. user.function
userSchema.methods.generateAuthToken = async function () {
  // We don't use arrow functions because we want scope of this
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.USER_SIGNING_SECRET
  );

  //Add the token to the users token array and save
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Add to the instance of the model i.e. User.function
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  // We don't use arrow functions because we want scope of this
  const user = this;

  // If the password was modified
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
