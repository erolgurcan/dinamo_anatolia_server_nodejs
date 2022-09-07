const router = require("express").Router();
const authorization = require("../middleware/authorization");
const { Client } = require("pg");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

router.get("/standingTable", authorization, async (req, res) => {
  try {
    const { league } = req.body;
    const user = await client.query(
      "select * from standing_table where league = " + "'" + league + "'"
    );
    res.json(user.rows);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/leagues", authorization, async (req, res) => {
  try {
    const result = await client.query("select league_name from league  ");
    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/get_event", authorization, async (req, res) => {
  try {
    const result = await client.query(
      " select * from events where league = 'Vancouver Metro Soccer League' "
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/standing", authorization, async (req, res) => {
  try {
    const league = req.header("league");
    const result = await client.query(
      "select * from standing_table where league = $1 ",
      [league]
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/scored_table", authorization, async (req, res) => {
  try {
    const league = req.header("league");
    console.log(league);
    const result = await client.query(
      "select * from scored_table where league = $1",
      [league]
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/update-user", authorization, async (req, res) => {
  console.log(req.body);

  const {
    user_name,
    address,
    postcode,
    country,
    state_region,
    mobile,
    user_email,
  } = req.body;

  const sqlString = `update users set user_name  =  '${user_name}' , address = '${address}', postcode = '${postcode}', country = '${country}', state_region  = '${state_region}' ,phone_number  = '${mobile}'  where user_email = '${user_email}';`;

  try {
    await client.query(sqlString);

    res.send(true);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/get_pay_table", authorization, async (req, res) => {
  try {
    const result = await client.query("select * from public.pay_table_view ");
    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
