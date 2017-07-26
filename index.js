const express = require("express");
const hbars = require("express-handlebars").create({
  defaultLayout: "main",
  extname: ".hbs"
});
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://andrew:qwerty@ds157521.mlab.com:57521/goj-jobs", {
  useMongoClient: true,
  /* other options */
});
const Jobs = require("./models/jobs.js");

app.engine(".hbs", hbars.engine);

app.set("view engine", ".hbs");
app.set("port", process.env.PORT || 3000);

// BD

Jobs.find((err, jobs) => {
  if (err) {
    return console.error(err);
  }

  if (jobs.length) {
    return;
  }

  new Jobs({
    name: "Работа 1",
    desc: "Описание работы 1",
    author: "andreww",
    rating: 80
  }).save();

  new Jobs({
    name: "Работа 2",
    desc: "Описание работы 2",
    author: "andreww",
    rating: 60
  }).save();

  new Jobs({
    name: "Работа 3",
    desc: "Описание работы 3",
    author: "wefgwgf",
    rating: 30
  }).save();

});

// FILES

let jobs = require("./response-example.json");

app.use((req, res, next) => {
  if (!res.locals.partials) {
    res.locals.partials = {};
  }

  res.locals.partials.jobsContext = jobs;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

// STATICS

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
