const request = require("request");

// $heads = array(
//   "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
//   "Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4",
//   "Origin: https://ru.socialclub.rockstargames.com",
//   "Referer: https://ru.socialclub.rockstargames.com/",
//   "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36"
// );

// $ch = curl_init();

// curl_setopt($ch, CURLOPT_URL, "https://ru.socialclub.rockstargames.com/");
// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_HTTPHEADER, $heads);
// curl_setopt($ch, CURLOPT_HEADER, true);

let options = {
  url: "https://ru.socialclub.rockstargames.com/",
  method: "GET",
  headers: {
    "Accept-Language": "ru-RU,ru",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36"
  }
};

request(options, (err, res, body) => {
  // console.log("*** ERROR:", err);
  // console.log("*** STATUS CODE:", res && res.statusCode);
  console.log("*** BODY:", body);
  console.log("Код:", res && res.statusCode);
});