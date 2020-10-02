const cons = require("consolidate");
const express = require("express");
const router = express.Router();

// [✔] Connect to database
var mysql = require("mysql");
const { use } = require("./staff");

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

// [✔] GET: Admin homepage
router.get("/home", async function (req, res) {
  var sql = "SELECT * FROM Account";
  connection.query(sql, (err, rows, field) => {
    console.log(rows);
    res.render("./admin/adminAccount", { result: rows });
  });
});

// [✔] Create account page
router.get("/home/add", async function (req, res) {
  res.render("./admin/addEmp");
});

// [✔] POST: Create new accout
router.post("/home/add", async function (req, res) {
  // Receive information from hbs
  let username = req.body.username;
  let password = req.body.password;
  let role = req.body.role;

  let sqlCheckAcc = `SELECT * FROM Account WHERE username='${username}'`;
  connection.query(sqlCheckAcc, (err, row, fields) => {
    if (row == "") {
      if (role == "trainer") {
        let sql = `INSERT INTO Account (username, password, role) VALUES ('${username}','${password}','${role}')`;

        connection.query(sql, (err) => {
          if (err) throw err;
        });

        let sql2 = `SELECT * FROM Account WHERE username='${username}'`;

        connection.query(sql2, (err, row) => {
          let sql3 = `INSERT INTO TutorAccount (tutor_id) VALUES (${row[0].user_id})`;

          connection.query(sql3, (err) => {
            if (err) throw err;
            res.redirect("/admin/home");
          });
        });
      } else {
        let sql = `INSERT INTO Account (username, password, role) VALUES ('${username}','${password}','${role}')`;

        connection.query(sql, (err) => {
          if (err) throw err;
          res.redirect("/admin/home");
        });
      }
    } else res.redirect("/admin/home");
  });
});

// POST: Edit account
router.post("/home/edit/:id", async function (req, res) {
  // Get account id from hbs
  let id = req.params.id;

  let username = req.body.username;
  let password = req.body.password;
  let role = req.body.role;

  let sql = `UPDATE Account SET username='${username}', password='${password}', role='${role}' WHERE user_id ='${id}'`;
  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/admin/home");
  });
});

// [✔] DELETE: Delete account
router.get("/home/delete/:id", async function (req, res) {
  let id = req.params.id;
  console.log(id);
  let sql = `DELETE FROM Account WHERE user_id='${id}'`;
  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/admin/home");
  });
});

// [✔] POST: Search for account
router.post("/home/search", async function (req, res) {
  // Get account id from hbs
  let key = req.body.key;
  console.log(key);

  let sql = `SELECT * FROM Account WHERE username LIKE '%${key}%'`;
  connection.query(sql, (err, rows, field) => {
    if (err) throw err;
    console.log(rows);
    let result = rows;
    res.render("./admin/adminAccount", { result: result });
  });
});

module.exports = router;
