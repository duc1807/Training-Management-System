const cons = require("consolidate");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/mailer");
//TESTT
// const nodemailer = require("nodemailer");
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//          user: 'ducdtgch18799@fpt.edu.vn',			//email ID
//        pass: 'duc123123'				//Password
//      }
//  });

//  function sendMail(email , otp){
// 	var details = {
// 		from: 'ducdtgch18799@fpt.edu.vn', // sender address same as above
// 		to: email, 					// Receiver's email id
// 		subject: 'Your demo OTP is ', // Subject of the mail.
// 		html: otp					// Sending OTP
// 	};

// 	transporter.sendMail(details, function (error, data) {
// 		if(error)
// 			console.log(error)
// 		else
//       console.log(data);
//       console.log('SENT')
// 		});
// 	}

// Initialize connection to mySQL
var mysql = require("mysql");

var connection = mysql.createConnection({
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

// ======================== Index Page

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
  var username = req.body.username;
  var password = req.body.password;

  //var sql = `SELECT * FROM Account WHERE username="${username}" AND password="${hashedPassword}"`

  var sql = `SELECT * FROM Account WHERE username="${username}"`;

  connection.query(sql, async (err, row, fields) => {
    console.log(row[0]["password"]);

    try {
      if (await bcrypt.compare(password, row[0].password)) {

        switch (row[0].role) {
          case "admin":
            var email = "bamboo.vennus@gmail.com"
            var otp = (Math.floor(Math.random() * ((9999 - 1000 + 1)) + 1000)).toString()
            sendMail(email,otp)
            res.render("./index/redirect", { otp: otp })
            break
          case "staff":
            res.redirect('/staff/home')
            break
          case "trainer":
            res.redirect('/tutor/home')
            break;
        }
        // if (row[0].role == "admin") {
        //   var email = "";
        //   var otp = "1123";
        //   //sendMail(email,otp);
        //   res.render("./index/redirect", { otp: otp });
        // } else {
        // }
      } else
        res.render("./index/test", {
          warning: "Incorrect username or password",
        });
    } catch {
      res.status(500).send();
    }
  });
});

router.post("/redirect", (req, res) => {
  const otp = req.body.otp;
  const otpInput = req.body.otpInput;

  if (otp == otpInput) res.redirect("/admin/home");
  else res.render("./index/test", { warning: "Invalid OTP" });
});

module.exports = router;
