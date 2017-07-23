let express = require("express");
let hbars = require("express-handlebars").create({ defaultLayout: "index" });

let app = express();

app.engine("handlebars", hbars.engine);

app.set("view engine", "handlebars");
app.set("port", process.env.PORT || 3000);

// FILES

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

app.listen(app.get("port"), () => {
  console.log("Server is running at http://localhost:" + app.get("port"));
});