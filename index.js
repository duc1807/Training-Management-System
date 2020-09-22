const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");

// Connect to database
const mongoPromises = require("./utils/mongoConnect.js");

app.use(bodyParser.urlencoded({ extended: true }));

// ======================== Index Pages

// GET: Login
router.get("/", async function (req, res) {
  try {
    const dbo = await mongoPromises()
    let result = await dbo.collection("Account").find({}).toArray()
    res.render("test", { result: result })
  } catch (err) {
    throw err
  }
});

// POST: Login
router.post("/", async (req, res) => {
  var username = req.body.username
  var password = req.body.password
  try {
    const dbo = await mongoPromises();
    let result = await dbo.collection("Account").findOne({userName: username, password: password}).toArray()
    console.log(check)
    res.render("test", { result: result })
  } catch (err) {
    throw err
  }
});

module.exports = router;
