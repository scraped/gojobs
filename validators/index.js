const Joi = require('joi');

const tokenRegex = /^[\w-]{22}$/;

const schemas = {
  jobId: Joi.string()
    .length(22)
    .regex(tokenRegex),

  username: Joi.string()
    .min(6)
    .max(16)
    .regex(tokenRegex),
};

const validate = (schemaName, value) => (
  !Joi.validate(value, schemas[schemaName].error)
);

// returns (value: any) => result: boolean
const validateFn = schemaName => validate.bind(null, schemaName);

module.exports = {
  schemas,
  validate,
  validateFn,
};
