const router = require("express").Router();
const { Client } = require("pg");
const bcrypt = require("bcrypt");
const { default: userEvent } = require("@testing-library/user-event");
const { response } = require("express");
const jTokenGenerator = require("../utils/jTokenGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});



client.connect();

router.post("/get-user", authorization, async (req, res) => {
  try {
    console.log(req.user);
    const user = await client.query("SELECT * FROM users WHERE user_id = $1", [
      req.user,
    ]);
    res.json(user.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/register", validInfo, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await client.query(
      "select * from users where  user_email = " + "'" + email + "';"
    );

    console.log(user);

    if (user.rows.length > 0) {
      res.status(401).send("User already exists");
      return;
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const cryptedPassword = await bcrypt.hash(password, salt);

    const newUser = await client.query(
      "INSERT INTO users(user_name, user_email, user_password) values($1, $2, $3) returning *",
      [name, email, cryptedPassword]
    );

    const token = jTokenGenerator(newUser.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/is-auth", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await client.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      res.status(401).send("Password or email incorrect");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      res.status(401).json("Password or email incorrect");
    }

    const token = jTokenGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
