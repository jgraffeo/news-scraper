const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const apiRoutes = require("./routes/api-routes");
const htmlRoutes = require("./routes/html-routes");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main.hbs"
  })
);
app.set("view engine", "hbs");


// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
//
app.use(apiRoutes);
app.use(htmlRoutes);

// Connect to the Mongo DB -- still unsure how
mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
