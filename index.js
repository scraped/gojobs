const express = require("express");
const hbars = require("express-handlebars").create({
  defaultLayout: "index",
  extname: ".hbs"
});

const app = express();

app.engine(".hbs", hbars.engine);

app.set("view engine", ".hbs");
app.set("port", process.env.PORT || 3000);

// FILES

let jobs = require("./response-example.json");

app.get("/", (req, res) => {
  res.render("index", {
    jobs: jobs.Missions
  });
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