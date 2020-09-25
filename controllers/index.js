const cons = require("consolidate");
const express = require("express");
const router = express.Router();
const multer = require("multer");

// Initialize connection to mySQL
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'learningmanagement'
})

connection.connect(function(err){
  if(!!err) console.log("Error")
  else console.log('Connected')
})

// Connect to database
const mongoPromises = require("../utils/mongoConnect.js");

// ======================== Index Page

// GET: Login
router.get("/", async function (req, res) {
  try {
    const dbo = await mongoPromises();
    let result = await dbo.collection("Account").find({}).toArray();
    res.render("test", { result: result });
  } catch (err) {
    throw err;
  }
});

// POST: Login
router.post("/", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  try {
    const dbo = await mongoPromises();
    let result = await dbo
      .collection("Account")
      .findOne({ Username: username });
    if (result == null) {
      res.render("test", {
        username: username,
        warning: "Incorrect Username or Password.",
      });
    } else {
      res.render("home", { result: result });
    }
  } catch (err) {
    throw err;
  }
});

//Test
router.get('/connect', (req,res)=> {
  connection.query("SELECT * FROM sample", function(err, rows, fields){
    if (!!err) console.log('Error')
    else {
      console.log('Success')
      var result = rows
      console.log(result)
      res.render("home", { result: result });
    }
  })
})

module.exports = router;
