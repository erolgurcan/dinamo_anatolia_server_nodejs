const router = require("express").Router();
const authorization = require("../middleware/authorization");
const connectionString = process.env.DATABASE_URL ;
const { Client } = require("pg");

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()

router.get("/", authorization, async (req, res) => {
  try {
    const user = await client.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [req.user]
    );
    res.json(user.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
