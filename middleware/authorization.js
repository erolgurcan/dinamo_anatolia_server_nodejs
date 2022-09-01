const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const jwtSecret = process.env.jwtSecret ? process.env.jwtSecret : "cat123";

  try {
    const jwtToken = req.header("token");
    if (!jwtToken) {
      res.status(403).json("Not Authorized");
    }

    const payload = jwt.verify(jwtToken, jwtSecret);
    req.user = payload.user;
    next();
  } catch (error) {
    console.log("middleware-error");
    console.log(error.message);
  }
};
