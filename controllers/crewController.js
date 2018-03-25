const Crew = require('../models/crew');

exports.crewList = async (req, res) => {
  const CREWS_PER_PAGE = 60;

  let { page } = req.query;

  page = Number(page);

  const crews = await Crew.find()
    .skip((page - 1) * CREWS_PER_PAGE);

  res.send(crews);
};
