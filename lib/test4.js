const mongoose = require('mongoose');
const Job = require('../models/job');
const RawJob = require('../models/raw-job');
require('../models/job-details')
const _ = require('lodash');
const fs = require('fs');
const axios = require('axios');
const tunnel = require('tunnel');

(async () => {
  try {
    const httpsOverHttpTunnel = tunnel.httpOverHttps({
      proxy: {
        host: '147.135.210.114',
        port: 54566
      },
    });

    const test = await axios({
      url: 'https://socialclub.rockstargames.com/member/andreww2012:443',
      httpsAgent: httpsOverHttpTunnel,
      proxy: false
    });

    console.log(test)
  } catch (error) {
    console.log(error);
  }
})();
