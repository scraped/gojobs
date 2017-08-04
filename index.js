const express = require("express");
const hbars = require("express-handlebars").create({
  defaultLayout: "main",
  extname: ".hbs",
  helpers: {
    upperCase: str => str.toUpperCase(),
    lowerCase: str => str.toLowerCase(),
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
const Job = require("./models/job.js");

app.engine(".hbs", hbars.engine);

app.set("view engine", ".hbs");
app.set("port", process.env.PORT || 3000);

// Промежуточное ПО

function getJobs(req, res, next) {
  if (!res.locals.partials) {
    res.locals.partials = {};
  }

  Job.find((err, response) => {
    if (err) {
      console.error(err);
    }

    res.locals.partials.jobsContext = response;
    next();
  });
}

// Main page

app.get("/", getJobs, (req, res) => {
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
