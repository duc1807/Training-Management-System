const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;

// Connect to database
const mongoPromises = require("../utils/mongoConnect.js");

// GET: Admin homepage
router.get("admin/home", async function (req, res) {
  try {
    const dbo = await mongoPromises()
    let result = await dbo.collection("Account").find({}).toArray()
    res.render("test", { result: result })
  } catch (err) {
    throw err
  }
});

// POST: Create new accout
router.post("admin/home", async function (req, res) {
  // Receive information from hbs
  let username = req.body.username
  let password = req.body.password
  let role = req.body.role
  let newAccount = { Username: username, Password: password, Role: role }

  const dbo = await mongoPromises()

  dbo.collection("Account").insertOne(newAccount, (res, err) => {
    if (err) throw err
    console.log("Add new account successfully")
    res.redirect("/admin/home")
  });
});

// GET: Edit account
router.get("admin/home/edit", async function (req, res) {
  // Get account id from hbs
  let id = req.query.id

  try {
    const dbo = await mongoPromises()
    let result = await dbo.collection("Account").findOne({ _id: ObjectId(id) })
    res.render("test", { result: result })
  } catch (err) {
    throw err
  }
});

// PUT: Update account
router.put("admin/home", async function (req, res) {
  // Receive information from hbs
  let username = req.body.username
  let password = req.body.password
  let role = req.body.role
  let updatedAccount = {$set:{ Username: username, Password: password, Role: role }}
  let condition = {_id: ObjectId(id)}

  try {
    const dbo = await mongoPromises()

    await dbo.collection("Account").updateOne(condition, updatedAccount)
    res.redirect("/admin/home")
  } catch (err) {
    throw err
  }
});

// DELETE: Delete account
router.delete("admin/home", async function (req, res) {
  try {
    const dbo = await mongoPromises()
    let result = await dbo.collection("Account").find({}).toArray()
    res.render("test", { result: result })
  } catch (err) {
    throw err
  }
});

module.exports = router;
