// Import framework/Library
const express = require("express");
const engines = require("consolidate");
const app = express();

// Create public directory to storing static files
var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

// Declare the view engine for the application
app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

// Initialize the controllers for the app
var controllerIndex = require("./index");

// Initialize the controller with its path
app.use("/", controllerIndex);

// Initialize the environment port | default port for the server
app.listen(process.env.PORT || 8080, function () {
  console.log("Server listening on port 8080");
});
