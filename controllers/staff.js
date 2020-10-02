const cons = require("consolidate");
const express = require("express");
const router = express.Router();

// [✔] Connect to database
var mysql = require("mysql");
const { use } = require("./admin");

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
  res.render("./staff/home");
});

//==================================================== GET: Trainee account management pages
router.get("/account/trainee", (req, res) => {
  let sql = `SELECT *, Course.courseName 
             FROM TraineeAccount
             INNER JOIN Course ON TraineeAccount.course_id = Course.course_id;
             SELECT *, Course.courseName
             FROM Category
             INNER JOIN Course ON Category.category_id = Course.category_id;
             SELECT * FROM Category`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;

    var category = [] 
    var isExisted = null

    for(f = 0; f < rows[2].length; f++)
    {
      category.push(
        {
          name: rows[2][f]['name'],
          description: []
        })
    }

    for (var i = 0; i < rows[1].length; i++)
    {
      var description = []
      for(var e = 0; e < category.length; e++)
      {
        isExisted = false
        if(rows[1][i]['name'] == category[e].name) 
        {
          isExisted = true
          category[e].description.push({
            course_id: rows[1][i]['course_id'],
            courseName: rows[1][i]['courseName']
          })
          break
        }       
      }      
      if (!isExisted) category.push({name: rows[1][i]['name'], description: description})
    }
    res.render("./staff/accountTrainee", { result: rows[0], category: rows[1], type: category });
  });
});

//************************************************ */ TEST

router.get("/account/trainee/add", (req, res) => {
  res.render("./staff/test/addTrainee");
});
//************************************************ */ TEST

// POST: Add trainee account
router.post("/account/trainee/add", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let dob = req.body.dob;
  let mainPL = req.body.mainPL;
  let expDetail = req.body.expDetail;
  let name = req.body.name;
  let age = req.body.age;
  let education = req.body.education;
  let toeic = req.body.toeic;
  let location = req.body.location;
  let course_id = req.body.course_id;

  let sql = `INSERT INTO TraineeAccount 
                (username, password, dob, mainPL, expDetail, name, age, education, toeic, location, course_id)
               VALUES (
                   '${username}','${password}','${dob}','${mainPL}','${expDetail}','${name}',${age},'${education}','${toeic}','${location}', ${course_id})`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/account/trainee");
  });
});

// POST: Edit trainee account
router.post("/account/trainee/edit/:id", (req, res) => {
  let id = req.params.id;

  let username = req.body.username;
  let password = req.body.password;
  let dob = req.body.dob;
  let mainPL = req.body.mainPL;
  let expDetail = req.body.expDetail;
  let name = req.body.name;
  let age = req.body.age;
  let education = req.body.education;
  let toeic = req.body.toeic;
  let location = req.body.location;
  let course_id = req.body.course_id;

  let sql = `UPDATE TraineeAccount 
               SET username = '${username}',password = '${password}',dob = '${dob}',mainPL = '${mainPL}',expDetail = '${expDetail}',name = '${name}',age = '${age}',education = '${education}',toeic = '${toeic}' ,location = '${location}', course_id = ${course_id}
               WHERE trainee_id = ${id}`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/account/trainee");
  });
});

// GET: Delete trainee account
router.get("/account/trainee/delete/:id", (req, res) => {
  let id = req.params.id;

  let sql = `DELETE FROM TraineeAccount WHERE trainee_id='${id}'`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/account/trainee");
  });
});

router.post("/account/trainee/search", (req, res) => {
  let key = req.body.key;

  let sql = `SELECT *, Course.courseName 
             FROM TraineeAccount 
             INNER JOIN Course ON TraineeAccount.course_id = Course.course_id
             WHERE username LIKE '%${key}%';
             SELECT *, Course.courseName
             FROM Category
             INNER JOIN Course ON Category.category_id = Course.category_id;
             SELECT * FROM Category`;

  connection.query(sql, (err, rows) => {
    if (err) throw err

    console.log(rows[0])
    var category = [] 
    var isExisted = null

    for(f = 0; f < rows[2].length; f++)
    {
      category.push(
        {
          name: rows[2][f]['name'],
          description: []
        })
    }

    for (var i = 0; i < rows[1].length; i++)
    {
      var description = []
      for(var e = 0; e < category.length; e++)
      {
        isExisted = false
        if(rows[1][i]['name'] == category[e].name) 
        {
          isExisted = true
          category[e].description.push({
            course_id: rows[1][i]['course_id'],
            courseName: rows[1][i]['courseName']
          })
          break
        }       
      }      
      if (!isExisted) category.push({name: rows[1][i]['name'], description: description})
    }

    res.render("./staff/accountTrainee", {result: rows[0], category: rows[1], type: category });
  });
});

//========================================================= End of Trainee account management pages

// GET: Trainer account management
router.get("/account/trainer", (req, res) => {
  res.render("./staff/accountTrainer");
});

//==================================================== GET: Category management pages

// GET: Category management
router.get("/category", (req, res) => {
  let sql = `SELECT * FROM Category`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./staff/category", { result: rows });
  });
});

// GET: Redirect to courses of selected category
router.get("/category/redirect/:id", (req, res) => {
  let id = req.params.id;

  let sql = `SELECT *, TutorAccount.name 
                FROM Course 
                INNER JOIN TutorAccount ON Course.tutor_id = TutorAccount.tutor_id 
                WHERE category_id = ${id}; 
                SELECT * 
                FROM TutorAccount`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;

    // if(rows[0] == "") res.render('./staff/course', {tutor: rows[1],category: id, notice: 'No course existed'})
    // else res.render('./staff/course', { result: rows[0], tutor: rows[1], joined: rows[2], category: id})
    res.render("./staff/course", {
      result: rows[0],
      tutor: rows[1],
      joined: rows[2],
      category: id,
    });
  });
});

//* TEST
router.get("/category/add", (req, res) => {
  res.render("./staff/test/addCategory");
});

// POST: Add new category
router.post("/category/add", (req, res) => {
  let name = req.body.name;
  let description = req.body.description;

  let sql = `INSERT INTO Category (name, description) VALUES ('${name}', '${description}')`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/category");
  });
});

// POST: Edit category
router.post("/category/edit/:id", (req, res) => {
  let id = req.params.id;

  let name = req.body.name;
  let description = req.body.description;

  let sql = `UPDATE Category SET name = '${name}', description = '${description}' WHERE category_id = ${id}`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/category");
  });
});

// GET: Delete category
router.get("/category/delete/:id", (req, res) => {
  let id = req.params.id;

  let sql = `DELETE FROM Category WHERE category_id = ${id}`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/category");
  });
});

// POST: Search category
router.post("/category/search", (req, res) => {
  let key = req.body.key;

  let sql = `SELECT * FROM Category WHERE name LIKE '%${key}%'`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./staff/category", { result: rows });
  });
});

//========================================================= End of Category management pages



//========================================================= Course management pages

// GET: Courses of category
router.get("/category/course", (req, res) => {
  let sql = `SELECT * FROM Course`;
  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./staff/course", { result: rows });
  });
});

// POST: Add new Course
router.post("/category/course/add", (req, res) => {
  let category_id = req.body.category_id;
  let name = req.body.courseName;
  let description = req.body.description;
  let tutor_id = req.body.tutor;

  let sql = `INSERT INTO Course (courseName, description, category_id, tutor_id)
                VALUES ('${name}','${description}', ${category_id}, ${tutor_id})`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    res.redirect(`/staff/category/redirect/${category_id}`);
  });
});

router.post("/category/course/edit/:id", (req, res) => {
  let category_id = req.body.category_id;

  let course_id = req.params.id;
  let name = req.body.courseName;
  let description = req.body.description;
  let tutor_id = req.body.tutor;

  let sql = `UPDATE Course SET courseName='${name}', description='${description}', tutor_id=${tutor_id}
                WHERE course_id = ${course_id}`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    res.redirect(`/staff/category/redirect/${category_id}`);
  });
});

// GET: Delete a course
router.get("/category/course/delete/:id", (req, res) => {
  let id = req.params.id;

  let sql = `SELECT category_id FROM Course WHERE course_id = ${id}; DELETE FROM Course WHERE course_id = ${id}`;
  connection.query(sql, (err, row) => {
    if (err) throw err;
    console.log("Day nay");
    console.log(row);
    console.log("rows 0");
    console.log(row[0][0]["category_id"]);
    res.redirect(`/staff/category/redirect/${row[0][0]["category_id"]}`);
  });
});

// GET: Redirect to topics
router.get('/category/course/redirect/:id', (req, res) => {
    let course_id = req.params.id
    
    let sql = `SELECT * FROM Topic WHERE course_id = ${course_id}`

    connection.query(sql, (err, rows) => {
        if(err) throw err
        res.render('./staff/topic')
    })
})

//========================================================= End of Course management pages

// GET: Topics of course
router.get("/category/course/topic", (req, res) => {
  res.render("./staff/topic");
});

module.exports = router;
