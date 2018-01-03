const axios = require('axios');

async function test() {
  let link = `http://localhost:3000/api/jobs`;

  let result = (await axios.get(link)).data;

  console.log(result);
}

test().catch(err => {
  console.log('Error:', err);
})
