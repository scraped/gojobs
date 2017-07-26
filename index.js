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

let jobs;
// let jobs = require("./response-example.json");
const request = require("request");

let options1 = {
  url: "https://ru.socialclub.rockstargames.com/",
  headers: {
    "Accept-Language": "ru-RU,ru",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36"
  }
};

let options2 = {
  url: "https://ru.socialclub.rockstargames.com/games/gtav/pc/jobs/",
  headers: {
    "Accept-Language": "ru-RU,ru",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36"
  }
}

let options3 = {
  url: "https://socialclub.rockstargames.com/games/gtav/ajax/search",
  method: "POST",
  headers: {
    "Accept-Language": "ru-RU,ru",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest"
  },
  formData: {
    "onlyCount": "false",
    "offset": 0,
    "SearchOptSubType": "",
    "SearchOptPublisher": "members",
    "SearchOptDate":"today",
    "SearchOptSort":"Liked",
    "SearchOptPlayers":"",
    "SearchText":""
  }
}

request(options1, (err, res, body) => {
  let cookies = res.headers["set-cookie"];
  cookies["RSWSID"] = cookies[1].match(/=([^;]*)/)[1]; // RockStarWebSessionId
  cookies["CSRFToken"] = cookies[2].match(/=([^;]*)/)[1]; // CSRFToken
  cookies["prod"] = cookies[3].match(/=([^;]*)/)[1]; // prod

  options2.headers.Cookie = "UAGD=1/1/1990; UAGC=1; gtav_jobsview=cols; CSRFToken=" + cookies["CSRFToken"] + "; prod=" + cookies["prod"] + "; RockStarWebSessionId=" + cookies["RSWSID"] + ";";

  request(options2, (err2, res2, body2) => {
    let token = body2.match(/value="([a-zA-Z0-9_-]*)" \/>\s*<\/div/mi);
    options3.headers.Cookie = options2.headers.Cookie;
    options3.headers.RequestVerificationToken = token[1];

    request(options3, (err3, res3, body3) => {
      jobs = JSON.parse(body3);
      console.log(jobs);
    });
  });
});


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