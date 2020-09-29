const cons = require("consolidate");
const express = require("express");
const router = express.Router();
const multer = require("multer");

// Initialize connection to mySQL
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12367447',
  password: 'vHENizWluh',
  database: 'sql12367447',
  port: 3306,
})

connection.connect(function(err){
  if(!!err) console.log(err)
  else console.log('Connected')
})

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
  var username = req.body.username
  var password = req.body.password

  var sql = `SELECT * FROM Account WHERE username="${username}" AND password="${password}"`
  connection.query(sql, (err, row, fields) => {
    if(row != "") {
      res.redirect("./admin/home")
    }
    else res.render("./index/test", {warning: "Incorrect username or password"})
  })
});

module.exports = router;
