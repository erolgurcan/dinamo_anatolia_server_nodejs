const router = require("express").Router();
const authorization = require("../middleware/authorization");
const { Client } = require("pg");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
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
    const result = await client.query(" select * from events where league = 'Vancouver Metro Soccer League' ");
    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/standing", authorization, async (req, res) => {
  try {
    const league = req.header("league");
    const result = await client.query(
      "select * from standing_table where league = $1 ", [league]
    );
    res.json(result.rows)
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/scored_table", authorization, async (req, res) => {
  try {
    const league = req.header("league");
    console.log(league);
    const result = await client.query(
      "select * from scored_table where league = $1", [league]
    );
    res.json(result.rows)
  } catch (error) {
    console.log(error.message);
  }
});


router.post("/update_user", async () => {

  try {
    const { user_name, address, postcode, country, state_region, phone_number, user_email } = req.body;
    
  } catch (error) {
    
  }
} )


module.exports = router;
