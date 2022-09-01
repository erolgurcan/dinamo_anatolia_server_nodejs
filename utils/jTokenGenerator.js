const jwt = require("jsonwebtoken");
require("dotenv").config();

function jTokenGenerator(user_id) {

  const jwtSecret= process.env.jwtSecret?  process.env.jwtSecret : "cat123"
  const payload = {
    user: user_id,
  };

  return jwt.sign(payload, jwtSecret, { expiresIn: "1hr" });
}

module.exports = jTokenGenerator;
