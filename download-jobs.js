const request = require('request');
const schedule = require('node-schedule');
const fs = require('fs');

let jobsTotal = 0;
let jobsProcessed = 0;

schedule.scheduleJob('0 * * * * *', () => {
  const date = new Date();
  const currentDate = date.getDate() + '-' + (date.getMonth() + 1) + '-'
    + date.getFullYear() + '_' + date.getHours() + '-' + date.getMinutes();
  const resFilename = './response/' + currentDate + '.json';

  let options = {
    url: 'https://ru.socialclub.rockstargames.com/',
    headers: {
      'Accept-Language': 'ru-RU,ru',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36'
    }
  };

  let formData = {
    'onlyCount': 'false',
    'offset': jobsProcessed,
    'SearchOptSubType': '',
    'SearchOptPublisher': 'members',
    'SearchOptDate':'last7',
    'SearchOptSort':'Liked',
    'SearchOptPlayers':'',
    'SearchText':''
  }

  console.log(new Date(), '<Start job execution>');

  request(options, (err, res, body) => {
    let cookies = res.headers['set-cookie'];
    // RockStarWebSessionId
    cookies['RSWSID']     = cookies[1].match(/=([^;]*)/)[1];
    // CSRFToken
    cookies['CSRFToken']  = cookies[2].match(/=([^;]*)/)[1];
    // prod
    cookies['prod']       = cookies[3].match(/=([^;]*)/)[1];

    options.headers.Cookie = 'UAGD=1/1/1990; UAGC=1; gtav_jobsview=cols; CSRFToken=' + cookies['CSRFToken'] + '; prod=' + cookies['prod'] + '; RockStarWebSessionId=' + cookies['RSWSID'] + ';';
    options.url = 'https://ru.socialclub.rockstargames.com/games/gtav/pc/jobs/';

    request(options, (err2, res2, body2) => {
      const token = body2.match(/value='([a-zA-Z0-9_-]*)' \/>\s*<\/div/mi);

      options.url = 'https://socialclub.rockstargames.com/games/gtav/ajax/search';
      options.headers.RequestVerificationToken = token[1];
      options.headers['X-Requested-With'] = 'XMLHttpRequest';
      options.method = 'POST';
      options.formData = formData;

      request(options, (err3, res3, body3) => {
        let jobs = JSON.parse(body3);

        if (!jobsTotal) {
          jobsTotal = jobs.Total;
        }

        fs.open(resFilename, 'w', 0644, (err, descriptor) => {
          if (!err) {
            fs.write(descriptor, body3, 0, 'utf8', (err, written, str) => {
              if (!err) {
                jobsProcessed += jobs.Count;
                if (jobsProcessed == jobsTotal) {
                  this.cancel();
                }
              } else {
                console.error('Cannot write response file:', err);
              }
            });
          } else {
            console.error('Cannot open response file:', err)
          }
        });
      });
    });
  });

  console.log(new Date(), '<End job execution>');
});

console.log(new Date(), 'The job has been started');
