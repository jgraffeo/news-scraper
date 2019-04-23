const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();


router.get("/", (req, res) => {
  res.render("home"); // or home?
});

router.get("/saved", (req, res) => {
	res.render("saved");
});

module.exports = router;