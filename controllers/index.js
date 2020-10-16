// Import .env file to retrieve TOKEN_SECRET_KEY
require("dotenv").config();

const express = require("express");
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
    res.render("./index/login");
  } catch (err) {
    throw err;
  }
});

// POST: Login
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM Account WHERE username="${username}"`;

  connection.query(sql, async (err, row, fields) => {
    if (row && row.length) {
      // Using compare() method of bcrypt to check the password is valid or not
      if (await bcrypt.compare(password, row[0].password)) {
        // If the account is valid and correct password, initialize Object user to store information
        user = {
          user_id: row[0].user_id,
          username: row[0].username,
          role: row[0].role,
        };
        // Switch account role
        switch (row[0].role) {
          case "admin":
            const salt = await bcrypt.genSalt(10);
            // Generate an OTP code to send via Email for admin authorization
            const otp = Math.floor(
              Math.random() * (9999 - 1000 + 1) + 1000
            ).toString();
            const email = "bamboo.vennus@gmail.com";
            // Hash the OTP code for more secure
            otpCheck = await bcrypt.hash(otp, salt);
            sendMail(email, otp);
            console.log("OTP Code: ", otp);
            // Redirect to the OTP code validation page
            res.render("./index/redirect");
            break;
          case "staff":
            // Initialize a token, with the payload is user Object and expired in 1h
            var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: "1h",
            });
            // Send the token via cookies with httpOnly: true for more secure
            res.cookie("token", accessToken, { httpOnly: true });
            // After sign the data, reset user Object
            user = undefined;
            res.redirect("/staff/home");
            break;
          case "trainer":
            // Similar with staff
            var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: "1h",
            });
            user = undefined;
            res.cookie("token", accessToken, { httpOnly: true });
            res.redirect("/tutor/home");
            break;
        }
      } else
        res.render("./index/login", {
          warning: "Incorrect password",
        });
    } else {
      res.render("./index/login", {
        warning: "Incorrect account",
      });
    }
  });
});

// GET: OTP validation page for admin
router.post("/redirect", async (req, res) => {
  const { otpInput } = req.body;

  // Check OTP code is valid or not
  if (await bcrypt.compare(otpInput, otpCheck)) {
    // Initialize the token if OTP code is valid
    var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    user = undefined;
    // Reset otpCheck variable
    otpCheck = undefined;

    res.cookie("token", accessToken, { httpOnly: true });
    res.redirect("/admin/home");
  } else res.render("./index/redirect", { warning: "Invalid OTP" });
});

// GET: Logout
router.get("/logout", function (req, res) {
  // Clear the token from cookies and render login page
  res.clearCookie('token')
  res.render(`./index/login`);
});

// GET: Status pages to notice user
router.get("/status/:id", function (req, res) {
  // Take the status code from url
  let status = req.params.id;
  // Render the error page with specific status code
  res.render(`./status/${status}`);
});

module.exports = router;
