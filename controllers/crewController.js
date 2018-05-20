const Crew = require('../models/crew');

exports.crewList = async (req, res) => {
  const CREWS_PER_PAGE = 600;

  const page = Number(req.body) || 1;

  const crews = await Crew.find()
    .skip((page - 1) * CREWS_PER_PAGE)
    .limit(CREWS_PER_PAGE);

  res.json({ crews: crews.map(crew => crew.toObject()) });
};
