const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

// Connect to database
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

// GET: Admin homepage
router.get("/home", async function (req, res) {
    var sql = "SELECT * FROM Account"
    connection.query(sql, (err, rows, field)=> {
      console.log(rows)
      res.render('adminAccount', {result: rows})
    })
});

// POST: Create new accout
router.post("/home/add", async function (req, res) {
  // Receive information from hbs
  let username = req.body.username
  let password = req.body.password
  let role = req.body.role

  let sql = `INSERT INTO Account (username, password, role) VALUES ('${ username}','${password}','${role}')`

  connection.query(sql, (err) => {
    if(err) throw err
    res.redirect("/admin/home")
  }) 
});

// POST: Edit account
router.post("/home/edit", async function (req, res) {
  // Get account id from hbs
  let id = req.query.id

  let username = req.body.username
  let password = req.body.password
  let role = req.body.role

  let sql = `UPDATE Account SET username='${username}', password='${password}', role='${role}' WHERE user_id ='6'`
  connection.query(sql, (err) => {
    if (err) throw err
    res.redirect('/admin/home')
  })
});

// DELETE: Delete account
router.get("/home/delete/:id", async function (req, res) {
  let id = req.params.id
  console.log(id)
  let sql = `DELETE FROM Account WHERE user_id='${id}'`
  connection.query(sql, (err)=> {
    if (err) throw err
    res.redirect('/admin/home')
  })
});

// POST: Search for account
router.get("/home/edit", async function (req, res) {
  // Get account id from hbs
  let key = req.body.key

  let sql = `SELECT * FROM Account WHERE username LIKE '%${key}%'`
  connection.query(sql, (err,rows, field) => {
    if (err) throw err
    console.log(rows)
  })
});

module.exports = router;
