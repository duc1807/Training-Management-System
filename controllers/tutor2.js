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
router.get('/home/:id', (req, res) => {

  let id = null 
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

module.exports = router