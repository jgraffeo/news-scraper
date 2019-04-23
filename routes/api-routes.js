const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");
const app = express();
// Require all models
const db = require("./models");

// For home pages

// A GET route for scraping the NPR Music website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.npr.org/sections/music-news/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h4 within an Headline tag, and do the following:
    $("article.item").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children("div.item-info").children("h2.title").text();

        result.summary = $(this).children("div.item-info").children("p.teaser").children("a").text();

        result.link = $(this).children("div.item-info").children("title").attr("href");

        // Create a new headline
        var newHeadline = new Headline(result);

        // Save that headline
        newHeadline.save(function(err, found) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(found);
            }
        });
        // Create a new Headline using the `result` object built from scraping
        // db.Headline.create(result)
        // .then(function(dbHeadline) {
        //     // View the added result in the console
        //     console.log(dbHeadline);
        // })
        // .catch(function(err) {
        //     // If an error occurred, log it
        //     console.log(err);
        // });
    });

    // Send a message to the client
    res.send("Scrape Complete");
    });
});

// To get the article scraped from mongo db
app.get("/headlines", function(req, res) {
    // Grab every document in the Articles collection
    db.Headline.find({})
    .then(function(found) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(found);
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
});

// Route for saving/updating an headline's associated Note
app.post("/save/:id", function(req, res) {
    // Create a new Note and pass the req.body to the entry
    db.Headline.findOneAndUpdate(
        { "_id": req.params.id }, { "saved": true })
    .exec(function(err, found) {
        if (err) {
            console.log(err);
        } 
        else {
            res.json(found);
        }
    });
});


// SAVED HEADLINES PAGE

// Get an article by id
app.get("/headlines/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Headline.findOne({ "_id": req.params.id })
    .exec(function(error, found) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(found);
      }
    });
});
  
  // Delete a saved headline
app.post("/delete/:id", function(req, res) {
// Use the Headline id to find and update it's saved property to false
    Headline.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
    // Execute the above query
    .exec(function(err, doc) {
        // Log any errors
        if (err) {
        console.log(err);
        }
        // Log result
        else {
        console.log("Headline Deleted");
        }
    });
    res.redirect("/saved");
});
  
  
  module.exports = app;