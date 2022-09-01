const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const path = require("path");
const { Client } = require("pg");
require('dotenv').config();



app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));


// DB Settings

app.listen(PORT, () => {
  console.log("Aplication started on port " + PORT);
});

//Routes

app.use( "/auth", require("./routes/jsonTokenAuth") );
app.use( "/teamInfo", require("./routes/teamInfo") );

//Api
