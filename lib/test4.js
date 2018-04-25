const palette = require('huey/palette');
// const dominant = require('huey/dominant');
// const axios = require('axios');
const jimp = require('jimp');
// const imageData = require('get-image-data');
// const chalk = require('chalk');

(async function() {
  const initialImage = await jimp.read('./image.png');

  initialImage.write('./temp.png', async () => {
    const image = await jimp.read('./temp.png');

    let pixels = [];

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, i) => {
      pixels.push(
        image.bitmap.data[i + 0],
        image.bitmap.data[i + 1],
        image.bitmap.data[i + 2],
        image.bitmap.data[i + 3],
      );
    });

    const r = palette(pixels, 3);

    let grad = 'linear-gradient(to right';

    for (let i = 0; i < r.length; i++) {
      const R = r[i][0],
        G = r[i][1],
        B = r[i][2];

      // const luma = 0.2126 * R + 0.7152 * G + 0.0722 * B;

      // const verdict = luma < 128 ? 'black' : 'white';

      // console.log('verdict: ' + verdict);

      grad += `, rgb(${R}, ${G}, ${B})`;
    }

    grad += ')';

    console.log(grad);
  });
}());
