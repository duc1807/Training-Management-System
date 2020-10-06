require("dotenv").config();

const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* Import module form other files */
const sendMail = require("../utils/mailer");

/* Initialize global var */
global.user = undefined;
global.otpCheck = undefined;

// Initialize connection to mySQL
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12367447",
  password: "vHENizWluh",
  database: "sql12367447",
  port: 3306,
});

connection.connect(function (err) {
  if (!!err) console.log(err);
  else console.log("Connected");
});

// ================================================================= Index Page

// GET: Login
router.get("/", async function (req, res) {
  try {
    res.render("./index/test");
  } catch (err) {
    throw err;
  }
});

// POST: Login
router.post("/", async (req, res) => {
  const { username, password } = req.body
  const sql = `SELECT * FROM Account WHERE username="${username}"`;

  connection.query(sql, async (err, row, fields) => {
    try {
      if (await bcrypt.compare(password, row[0].password)) {
        user = {
          user_id: row[0].user_id,
          username: row[0].username,
          role: row[0].role,
        };

        switch (row[0].role) {
          case "admin":
            const salt = await bcrypt.genSalt(10);
            const otp = Math.floor(
              Math.random() * (9999 - 1000 + 1) + 1000
            ).toString();
            const email = "bamboo.vennus@gmail.com";
            otpCheck = await bcrypt.hash(otp, salt);
            sendMail(email, otp);
            console.log("OTP Code: ", otp);
            res.render("./index/redirect");
            break;
          case "staff":
            var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: "1h",
            });
            user = undefined;
            res.cookie("token", accessToken, { httpOnly: true });
            res.redirect("/staff/home");
            break;
          case "trainer":
            var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: "1h",
            });
            user = undefined;
            res.cookie("token", accessToken, { httpOnly: true });
            res.redirect("/tutor/home");
            break;
        }
      } else
        res.render("./index/test", {
          warning: "Incorrect username or password",
        });
    } catch {
      res.status(500).send();
    }
  });
});

router.post("/redirect", async (req, res) => {
  const { otpInput } = req.body;

  if (await bcrypt.compare(otpInput, otpCheck)) {
    var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    user = undefined;
    otpCheck = undefined;

    res.cookie("token", accessToken, { httpOnly: true });
    res.redirect("/admin/home");
  } else res.render("./index/redirect", { warning: "Invalid OTP" });
});

module.exports = router;
