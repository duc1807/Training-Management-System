const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Use middleware for validation
router.use(adminValidation);

// Connect to database
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
  else console.log(`Connected to ${connection.config.host}`);
});

// GET: Admin homepage
router.get("/home", async function (req, res) {
  var sql = "SELECT * FROM Account";
  connection.query(sql, (err, rows, field) => {
    res.render("./admin/adminAccount", { result: rows, warningMessage: req.session.warningMessage })
    req.session.warningMessage = undefined;
  });
});

// POST: Create new accout
router.post("/home/add", async function (req, res) {
  // Receive information from hbs
  const { username, password, role } = req.body;

  let sqlCheckAcc = `SELECT * FROM Account WHERE username='${username}'`;
  connection.query(sqlCheckAcc, async (err, row, fields) => {

    // Generate salt (as known as secret key) to hash the data
    const salt = await bcrypt.genSalt(10);

    // Check if the username is  duplicated or not
    if (row == "") {
      /* If the trainer account is created in table Account, the TrainerAccount table 
       also needs to create the corresponding trainer account */
      if (role == "trainer") {
        try {
          // Hash the password for more secure
          const hashedPassword = await bcrypt.hash(password, salt);

          let sql = `INSERT INTO Account (username, password, role) VALUES ('${username}','${hashedPassword}','${role}')`;

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
        } catch {
          res.status(500).send();
        }
      } else {
        try {
          // Admin and staff accounts creation
          const hashedPassword = await bcrypt.hash(password, salt);
          let sql = `INSERT INTO Account (username, password, role) VALUES ('${username}','${hashedPassword}','${role}')`;

          connection.query(sql, (err) => {
            if (err) throw err;
            res.redirect("/admin/home");
          });
        } catch {
          res.status(500).send();
        }
      }
    } else res.redirect("/admin/home");
  });
});

// POST: Edit accounts
router.post("/home/edit/:id", async function (req, res) {
  // Get account id from hbs
  const id = req.params.id;

  const { username, password, role } = req.body;

  // Password hashed
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let sqlCheckAcc = `SELECT * FROM Account WHERE username='${username}' OR user_id = ${id}`;
  connection.query(sqlCheckAcc, (err, row) => {
    // Check if the username is not duplicated
    if (row.length <2) {
      // The password will be ignored if it's not being changed
      if(!password) {
        var sql = `UPDATE Account 
        SET username='${username}',       
        role='${role}' 
        WHERE user_id ='${id}'`;
      }
      else {
        var sql = `UPDATE Account 
        SET username='${username}',  
        password='${hashedPassword}',
        role='${role}' 
        WHERE user_id ='${id}'`;
      }   
      
      connection.query(sql, (err) => {
        if (err) throw err;
        res.redirect("/admin/home");
      });

    } else {
      // Set warning message in case the username is duplicated
      req.session.warningMessage = "Invalid username, this username has existed!"
      res.redirect('/admin/home')
    }
  });
});

// DELETE: Delete account
router.get("/home/delete/:id", async function (req, res) {
  let id = req.params.id;
  let sql = `DELETE FROM Account WHERE user_id='${id}'`;
  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/admin/home");
  });
});

// POST: Search for account
router.post("/home/search", async function (req, res) {
  // Get search keyword 
  let key = req.body.key;

  let sql = `SELECT * FROM Account WHERE username LIKE '%${key}%'`;
  connection.query(sql, (err, rows, field) => {
    if (err) throw err;
    res.render("./admin/adminAccount", { result: rows });
  });
});

function adminValidation(req, res, next) {
  // Retrieve the token from cookies
  const token = req.cookies["token"];
  // If the token is not existed, throw 401 error
  if (!token) {
    res.redirect('/status/401');
  }
  // Check if the token is not valid | expired, throw 401 error if true
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.redirect('/status/401');
    // If the user permission is not admin, throw the 401 error to prevent unauthorised access
    if (user.role != "admin") res.redirect('/status/401');
    next();
  });
}

module.exports = router;
