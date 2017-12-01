const axios = require('axios');

async function test() {
  let link = `https://socialclub.rockstargames.com/crew/zachetka`;

  let result = (await axios.get(link)).data;

  let idAndAvatarMatch = result.match(/crews\/sc\/(\d+)\/(\d+)\/publish\//);
  let nameMatch = result.match(/\\"crewname\\":\\"([\w -]+)\\"/);
  let tagMatch = result.match(/\\"tag\\":\\"(\w+)\\"/);
  let colorMatch = result.match(/\\"crewColor\\":\\"#(\w+)\\"/);

  console.log(idAndAvatarMatch[2], nameMatch[1], tagMatch[1], colorMatch[1]);
}

test().catch(err => {
  console.log('Error:', err);
})
