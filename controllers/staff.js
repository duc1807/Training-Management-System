const express = require("express");
const router = express.Router();

// [✔] Connect to database
var mysql = require('mysql');
const { use } = require("./admin");

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

// GET: Home
router.get('/home', (req, res) => {
    res.render('./staff/home')
})

//==================================================== GET: Trainee account management pages
router.get('/account/trainee', (req, res) => {

    let sql = `SELECT * FROM TraineeAccount`

    connection.query(sql, (err, rows) => {
        if(err) throw err
        res.render('./staff/accountTrainee', {result: rows})
    })
})

//************************************************ */ TEST

router.get('/account/trainee/add', (req, res) => {
    res.render('./staff/test/addTrainee')
})
//************************************************ */ TEST


// POST: Add trainee account
router.post('/account/trainee/add', (req, res) => {

    let username = req.body.username
    let password = req.body.password
    let dob = req.body.dob
    let mainPL = req.body.mainPL
    let expDetail = req.body.expDetail
    let name = req.body.name
    let age = req.body.age
    let education = req.body.education
    let toeic = req.body.toeic
    let location = req.body.location

    let sql = `INSERT INTO TraineeAccount 
                (username, password, dob, mainPL, expDetail, name, age, education, toeic, location)
               VALUES (
                   '${username}','${password}','${dob}','${mainPL}','${expDetail}','${name}',${age},'${education}',${toeic},'${location}')`

    connection.query(sql, (err) => {
        if(err) throw err
        res.redirect('/staff/account/trainee')
    })
})

// POST: Edit trainee account
router.post('/account/trainee/edit/:id', (req, res) => {
    let id = req.params.id

    let username = req.body.username
    let password = req.body.password
    let dob = req.body.dob
    let mainPl = req.body.mainPl
    let expDetail = req.body.expDetail
    let name = req.body.name
    let age = req.body.age
    let education = req.body.education
    let toeic = req.body.toeic
    let location = req.body.location

    let sql = `UPDATE TraineeAccount 
               SET username = '${username}',password = '${password}',dob = '${dob}',mainPL = '${mainPl}',expDetail = '${expDetail}',name = '${name}',age = '${age}',education = '${education}',toeic = '${toeic}' ,location = '${location}'
               WHERE trainee_id = ${id}`

    connection.query(sql, (err) => {
        if(err) throw err
        res.redirect('/staff/account/trainee')
    })
})

// GET: Delete trainee account
router.get('/account/trainee/delete/:id', (req, res) => {
    let id = req.params.id

    let sql = `DELETE FROM TraineeAccount WHERE trainee_id='${id}'`

    connection.query(sql, (err) => {
        if(err) throw err
        res.redirect('/staff/account/trainee')
    })
})

//========================================================= End of Trainee account management pages

// GET: Trainer account management
router.get('/account/trainer', (req, res) => {
    res.render('./staff/accountTrainer')
})

//==================================================== GET: Category management pages

// GET: Category management
router.get('/category', (req, res) => {
    let sql = `SELECT * FROM Category`

    connection.query(sql, (err, rows) => {
        if(err) throw err
        res.render('./staff/category', { result: rows })
    })  
})
//* TEST
router.get('/category/add', (req, res) => {
    res.render('./staff/test/addCategory')
})

// POST: Add new category
router.post('/category/add', (req, res) => {
    let name = req.body.name
    let description = req.body.description

    let sql = `INSERT INTO Category (name, description) VALUES ('${name}', '${description}')`

    connection.query(sql, (err) => {
        if(err) throw err
        res.redirect('/staff/category')
    })
})

// POST: Edit category
router.post('/category/edit/:id', (req, res) => {

    let id = req.params.id

    let name = req.body.name
    let description = req.body.description

    let sql = `UPDATE Category SET name = '${name}', description = '${description}' WHERE category_id = ${id}`

    connection.query(sql, (err) => {
        if(err) throw err
        res.redirect('/staff/category')
    })
})

// GET: Delete category
router.get('/category/delete/:id', (req, res) => {

    let id = req.params.id

    let sql = `DELETE FROM Category WHERE category_id = ${id}`

    connection.query(sql, (err) => {
        if(err) throw err
        res.redirect('/staff/category')
    })
})

// POST: Search category
router.post('/category/search', (req, res) => {
    let key = req.body.key

    let sql = `SELECT * FROM Category WHERE name LIKE '%${key}%'`

    connection.query(sql, (err, rows) => {
        if(err) throw err
        res.render('./staff/category', { result: rows })
    })
})

//========================================================= End of Category management pages







//========================================================= Course management pages

// GET: Courses of category
router.get('/category/course', (req, res) => {
    res.render('./staff/course')
})

//========================================================= End of Course management pages





// GET: Topics of course
router.get('/category/course/topic', (req, res) => {
    res.render('./staff/topic')
})


module.exports = router