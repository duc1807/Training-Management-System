const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.use(trainerValidation);

// [✔] Connect to database
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12367447",
  password: "vHENizWluh",
  database: "sql12367447",
  port: 3306,
  multipleStatements: true,
});

connection.connect(function (err) {
  if (!!err) console.log(err);
  else console.log("Connected");
});

// GET: Home
router.get("/home", (req, res) => {
  let id = req.user.user_id;
  let sql = `SELECT * FROM Course WHERE tutor_id = ?; SELECT * FROM TutorAccount WHERE tutor_id = ?`;

  connection.query(sql, [id, id], (err, rows) => {
    if (err) throw err;
    else if (rows[0] == "" && rows[1].length)
      res.render("./tutor/home", {
        result: rows[0],
        tutorName: rows[1][0].name,
      });
    else
      res.render("./tutor/home", {
        result: rows[0],
        tutorName: rows[1][0].name,
        course_id: rows[0][0].course_id,
        active: { home: true, profile: false },
        partials: { menuPartial: "../partials/trainer_nav" },
      });
  });
});

// GET: Profile
router.get("/profile", (req, res) => {
  let id = req.user.user_id;

  let sql = `SELECT * FROM TutorAccount WHERE tutor_id = ${id}`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./tutor/profile", { 
      result: rows[0],
      active: { home: false, profile: true },
      partials: { menuPartial: "../partials/trainer_nav" }});
  });
});

// POST: Update profile
router.post("/profile/edit/:id", (req, res) => {
  let id = req.params.id;

  const { name, age, phone, email } = req.body;

  let sqlCheck = `SELECT * FROM TutorAccount WHERE user_id = '${id}'`;

  connection.query(sqlCheck, (err, row) => {
    if (row != "") {
      let sql = `UPDATE TutorAccount 
                    SET 
                      name = '${name}',
                      age = '${age}',
                      phone = '${phone}',
                      email = '${email}'
                    WHERE tutor_id = ${id}`;
      connection.query(sql, (err) => {
        if (err) throw err;
        res.redirect("/tutor/profile");
      });
    } else {
      let sql = `INSERT INTO TutorAccount 
                    (tutor_id, name, age, phone, email)
                    VALUES 
                    (${id},'${name}',${age},${phone},'${email}')`;
      connection.query(sql, (err) => {
        if (err) throw err;
        res.redirect("/tutor/home");
      });
    }
  });
});

router.get("/topic/redirect/:id", (req, res) => {
  const id = req.params.id;

  const sql = `SELECT *, name
               FROM Topic
               LEFT JOIN TutorAccount ON Topic.tutor_id = TutorAccount.tutor_id
               WHERE course_id = ${id}; SELECT * FROM Course WHERE course_id = ${id}`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./tutor/topic", {
      result: rows[0],
      courseName: rows[1][0].courseName,
    });
  });
});

function trainerValidation(req, res, next) {
  const token = req.cookies["token"];
  if (!token) {
    res.redirect("/status/401");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.redirect("/status/401");
    req.user = user;
    if (user.role != "trainer") res.redirect("/status/401");
    else next();
  });
}

module.exports = router;
