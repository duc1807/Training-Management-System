// Import framework/Library
const express = require("express");
const engines = require("consolidate");
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser'); 
app.use(cookieParser()); 

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Create public directory to storing static files
var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

// Declare the view engine for the application
app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

// Initialize session
app.use(session
  ({
  secret: "hashed-secret-key",
  saveUninitialized:false, 
  resave: false
  }));

// Initialize the controllers for the app
var controllerIndex = require("./controllers/index")
var controllerAdmin = require("./controllers/admin")
var controllerStaff = require("./controllers/staff")
var controllerTutor = require("./controllers/tutor")
var controllertutor2 = require("./controllers/tutor2")

// Initialize the controller with its path
app.use("/", controllerIndex)
app.use("/admin", controllerAdmin)
app.use("/staff", controllerStaff)
app.use("/tutor", controllerTutor)
app.use("/tutor2",controllertutor2)

// Initialize the environment port | default port for the server
app.listen(process.env.PORT || 8080, function () {
  console.log("Server running on port 8080");
});
