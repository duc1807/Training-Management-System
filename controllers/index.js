const express = require("express");
const router = express.Router();
const multer = require("multer");

// Connect to database
const mongoPromises = require("../utils/mongoConnect.js");

// ======================== Index Page

// GET: Login
router.get("/", async function (req, res) {
  try {
    const dbo = await mongoPromises();
    let result = await dbo.collection("Account").find({}).toArray();
    res.render("test", { result: result });
  } catch (err) {
    throw err;
  }
});

// POST: Login
router.post("/", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  try {
    const dbo = await mongoPromises();
    let result = await dbo
      .collection("Account")
      .findOne({ Username: username });
    if (result == null) {
      res.render("test", {
        username: username,
        warning: "Incorrect Username or Password.",
      });
    } else {
      res.render("home", { result: result });
    }
  } catch (err) {
    throw err;
  }
});

module.exports = router;
