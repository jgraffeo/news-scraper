var express = require("express");
var exphbs = require("express-handlebars");

//initialize express
var app = express();

app.get("/", (req, res) => {
  res.render("main"); // or home?
});

app.get("/saved", (req, res) => {
	res.render("saved");
});

module.exports = app;