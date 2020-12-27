const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // Get token from Auth header
    const token = req.header("Authorization").replace("Bearer ", "");

    // Verify the signature on the token matches the key on the server
    const decodedPayload = jwt.verify(token, process.env.USER_SIGNING_SECRET);

    // Get the user where the id matches the token, and the token exists in the sessions array
    const user = await User.findOne({
      _id: decodedPayload._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    // Add on the user to the request so we don`t have to fetch it again later
    req.user = user;
    req.token = token;
    return next();
  } catch {
    res.status(401).send({ error: "Please Authenticate" });
  }
};

module.exports = auth;
