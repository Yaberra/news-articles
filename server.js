var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require ("request")
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoHeadlines");

// Routes

// A GET route for scraping the washington post website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.washingtonpost.com/people/sari-horwitz/?utm_term=.ce1e27e8c2e9").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
   
    // Grab .pb-local-content tag, and do the following:
    $(".pb-local-content").each(function(i, element) {
      //Create an empty result object
      var result = {};

      console.log("result");

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
      .children(".pb-feed-headline")
      .children("h3")
      .children("a")
      .text();
      result.link = $(this)
      .children("a")
      .attr("href");
      result.image = $(this)
      .children("a")
      .children("img")
      .attr("src");
      result.blurb = $(this)
      .children(".pb-feed-description")
      .text();
      
      console.log("articles", i, result);
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
         console.log(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});


// Retrieve data from the db
app.get("/articles", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.Article.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// For adding a saved article to the database 

app.post("/articles/:id", (req, res) => {
 db.Article.create(req.body)
   .then(function(dbArticle) {
     
      res.json(dbArticle);
    })
     .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    })
    });

 // Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
