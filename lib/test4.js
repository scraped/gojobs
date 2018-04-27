const palette = require('huey/palette');
const jimp = require('jimp');
const sharp = require('sharp');

(async function() {
  const initialImage = await jimp.read('https://prod.cloud.rockstargames.com/ugc/gta5mission/2396/xQ9d3-XUpU6WB1u46Skcxw/2_0.jpg');

  initialImage.getBuffer(jimp.AUTO, async (err, buffer) => {
    const imagePng = await sharp(buffer).png().toBuffer();

    // initialImage.write('./temp.png', async () => {
    const image = await jimp.read(imagePng);

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
