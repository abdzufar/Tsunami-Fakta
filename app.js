require('dotenv').config();
const express = require("express");
const session = require('express-session');
const app = express();
const router = require("./routes");
const port = 3000;

app.use(express.static("uploads"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}));
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
