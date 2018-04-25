const palette = require('huey/palette');
const axios = require('axios');

(async function() {
  const result = await axios.get('https://prod.cloud.rockstargames.com/ugc/gta5mission/6658/cQr_aIGBr0m5gNYwbpWHdw/1_0.jpg');

  const r = palette(new Buffer(result.data), 3);

  let grad = 'linear-gradient(to right';

  for (let i = 0; i < r.length; i++) {
    const R = r[i][0],
      G = r[i][1],
      B = r[i][2];

    const luma = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    const verdict = luma < 128 ? 'black' : 'white';

    console.log('verdict: ' + verdict);

    grad += `, rgb(${R}, ${G}, ${B})`;
  }

  grad += ')';

  console.log(grad);
}());
