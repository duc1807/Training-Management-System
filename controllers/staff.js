const express = require("express");
const router = express.Router();

// [✔] Connect to database
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

// GET: Home
router.get('/home', (req, res) => {
    res.render('./staff/home')
})

//================================ GET: Trainee account management pages
router.get('/account/trainee', (req, res) => {
    res.render('./staff/accountTrainee')
})

// POST: Add new trainee account
router.post('/account/trainee/add', (req, res) => {
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

    let sql = null

    connection.query(sql, (err) => {
        if(err) throw err
        res.redirect('/staff/account/trainee')
    })
})

// POST: Add new trainee account
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

    let sql = null

    connection.query(sql, (err) => {
        if(err) throw err
        res.redirect('/staff/account/trainee')
    })
})

// POST: Delete trainee account
router.post('/account/trainee/delete/:id', (req, res) => {
    let id = req.params.id

    let sql = `DELETE FROM trainee WHERE user_id='${id}`

    connection.query(sql, (err) => {
        if(err) throw err
        res.redirect('/staff/account/trainee')
    })
})

//================================ End of Trainee account management pages

// GET: Trainer account management
router.get('/account/trainer', (req, res) => {
    res.render('./staff/accountTrainer')
})

// GET: Category management
router.get('/category', (req, res) => {
    res.render('./staff/category')
})

// GET: Courses of category
router.get('/category/course', (req, res) => {
    res.render('./staff/course')
})

// GET: Topics of course
router.get('/category/course/topic', (req, res) => {
    res.render('./staff/topic')
})


module.exports = router