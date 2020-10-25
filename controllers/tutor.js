const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Using middleware for authorization
router.use(trainerValidation);

// Using partial view (navigation)
const MENU_PARTIAL = "../partials/trainer_nav"

// [✔] Connect to database
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "remotemysql.com",
  user: "NoyWf02HHi",
  password: "VUZIWf1hGV",
  database: "NoyWf02HHi",
  port: 3306,
  multipleStatements: true,
});

connection.connect(function (err) {
  if (!!err) console.log(err);
  else console.log("Connected");
});

// GET: Homepage of trainer
router.get("/home", (req, res) => {
  let id = req.user.user_id;
  // Query all the course that taken by trainer and trainer information
  let sql = `SELECT * FROM Course WHERE tutor_id = ?; SELECT * FROM TutorAccount WHERE tutor_id = ?`;

  connection.query(sql, [id, id], (err, rows) => {
    if (err) throw err;
    // If the trainer has not been signed to any course, the course_id is ignored
    else if (rows[0] == "" && rows[1].length)
      res.render("./tutor/home", {
        result: rows[0],
        tutorName: rows[1][0].name,
        active: { home: true, profile: false },
        // send the path of partial view
        partials: { menuPartial: MENU_PARTIAL },
      });
    else
      res.render("./tutor/home", {
        result: rows[0],
        tutorName: rows[1][0].name,
        course_id: rows[0][0].course_id,
        active: { home: true, profile: false },
        partials: { menuPartial: MENU_PARTIAL },
      });
  });
});

// POST: Search for courses
router.post("/search", (req, res) => {
  let key = req.body.key;
  // Take the id of the current logged in trainer account
  const id = req.user.user_id;
  // Take all the courses that taken by the trainer
  let sql = `SELECT * FROM Course WHERE courseName LIKE '%${key}%' AND tutor_id = ?; SELECT * FROM TutorAccount WHERE tutor_id = ?`;

  connection.query(sql, [id, id], (err, rows) => {
    if (err) throw err;
    else if (rows[0] == "" && rows[1].length)
      res.render("./tutor/home", {
        result: rows[0],
        tutorName: rows[1][0].name,
        active: { home: true, profile: false },
        partials: { menuPartial: MENU_PARTIAL },
      });
    else
      res.render("./tutor/home", {
        result: rows[0],
        tutorName: rows[1][0].name,
        course_id: rows[0][0].course_id,
        active: { home: true, profile: false },
        partials: { menuPartial: MENU_PARTIAL },
      });
  });
});

// GET: Profile
router.get("/profile", (req, res) => {
  // Take the id of the current logged in trainer account
  let id = req.user.user_id;

  let sql = `SELECT * FROM TutorAccount WHERE tutor_id = ${id}`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./tutor/profile", { 
      result: rows[0],
      active: { home: false, profile: true },
      partials: { menuPartial: MENU_PARTIAL }});
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

// Middleware for validation 
function trainerValidation(req, res, next) {
  // Retrieve token from cookies
  const token = req.cookies["token"];
  // If the token is not existed, throw 401 error
  if (!token) {
    res.redirect("/status/401");
  }
  // Verify token to check if its expired or not
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.redirect("/status/401");
    // Assign the payload to the HTTP Request
    req.user = user;
    if (user.role != "trainer") res.redirect("/status/401");
    else next();
  });
}

module.exports = router;
