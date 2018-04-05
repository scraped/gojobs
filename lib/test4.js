const axios = require('axios');

(async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://yandex.ru',
      azaza: 'test2'
    });
    console.log(response.config.azaza);
  } catch (error) {
    console.log('error: ', error);
  }
})();
