const RawJob = require('../models/raw-job');

(async () => {
  const a = new RawJob().toObject();

  console.log(a);
})();
