const express = require("express");
const hbars = require("express-handlebars").create({
  defaultLayout: "main",
  extname: ".hbs",
  helpers: {
    capitalize: str => str.toUpperCase(),
    ratingTagColor: rating => {
      return (rating >= 67) ? "success" :
             (rating >= 34) ? "warning" :
             "danger";
    },
  },
});
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://andrew:qwerty@ds157521.mlab.com:57521/goj-jobs", {
  useMongoClient: true,
});
const Jobs = require("./models/jobs.js");

app.engine(".hbs", hbars.engine);

app.set("view engine", ".hbs");
app.set("port", process.env.PORT || 3000);

let jobs = require("./response-example.json");

app.use((req, res, next) => {
  if (!res.locals.partials) {
    res.locals.partials = {};
  }

  res.locals.partials.jobsContext = jobs;
  next();
});

// Main page

app.get("/", (req, res) => {
  res.render("index");
});

// Static files

app.use(express.static("public"));

// 404

app.use((req, res) => {
  res.status(404);
  res.render("404");
});

// 500

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500);
  res.render("500");
});

// LISTEN

app.listen(app.get("port"), () => {
  console.log("Server is running at http://localhost:" + app.get("port"));
});
