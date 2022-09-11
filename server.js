const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 6000;
const path = require("path");
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("asd");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("/events", async (req, res) => {
  try {
    const result = await client.query(
      "select * from events where event_date2 > now()"
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// DB Settings

app.listen(PORT, () => {
  console.log("Aplication started on port " + PORT);
});

//DB Connect
client.connect();

//Routes
app.use("/auth", require("./routes/jsonTokenAuth"));
app.use("/teamInfo", require("./routes/teamInfo"));
