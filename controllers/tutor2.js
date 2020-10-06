const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')

router.use(trainerValidation)

// [✔] Connect to database
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12367447',
  password: 'vHENizWluh',
  database: 'sql12367447',
  port: 3306,
  multipleStatements: true
})

connection.connect(function(err){
  if(!!err) console.log(err)
  else console.log('Connected')
})

// GET: Home
router.get('/home', (req, res) => {

  let id = req.user.user_id  

  let sql = `SELECT * FROM Course WHERE tutor_id = ?; SELECT * FROM TutorAccount WHERE tutor_id = ?`

  connection.query(sql, [id,id], (err, rows) => {
    if(err) throw err

    res.render('./tutor2/home', {result: rows[0], account: rows[1]})
  })   

  
})

// POST: Update profile
router.post('/profile/edit/:id', (req, res) => {
    let id = req.params.id

    let name = req.body.name
    let age = req.body.age
    let type = req.body.type
    let workingPlace = req.body.workingPlace
    let phone = req.body.phone
    let email = req.body.email

    let sqlCheck = `SELECT * FROM TutorAccount WHERE user_id = '${id}'`

    connection.query(sqlCheck, (err, row) => {
      if(row != "") {
        let sql  = `UPDATE TutorAccount 
                    SET 
                      name = '${name}'
                      age = '${age}'
                      type = '${type}'
                      workingPlace = '${workingPlace}'
                      phone = '${phone}'
                      email = '${email}'
                    WHERE tutor_id = '${id}'`
        connection.query(sql, (err) => {
          if(err) throw err
          res.redirect('/tutor2/home')
        })
      }
      else {
        let sql  = `INSERT INTO TutorAccount 
                    (tutor_id, name, age, type, workingPlace, phone, email)
                    VALUES 
                    (${id},'${name}',${age},'${type}','${workingPlace}',${phone},'${email}')`
        connection.query(sql, (err) => {
          if(err) throw err
          res.redirect('/tutor2/home')
        })
      }
    })
})

function trainerValidation(req, res, next) {
  const token = req.cookies['token']
  if(!token) 
  {
    res.sendStatus(401)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    if(user.role != 'trainer') res.sendStatus(403)
    next()
  })
}

module.exports = router