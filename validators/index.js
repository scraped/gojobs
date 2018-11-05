const Joi = require('joi');

const schemas = {
  jobId: Joi.string()
    .length(22)
    .regex(/^[\w-]{22}$/),

  username: Joi.string()
    .min(6)
    .max(16)
    .regex(/^[\w_.-]+$/),

  email: Joi.string()
    .email(),

  password: Joi.string()
    .min(6)
    .max(40)
    .token(),
};

const validate = (schemaName, value) => (
  !Joi.validate(value, schemas[schemaName]).error
);

const validateFn = schemaName => validate.bind(null, schemaName);

module.exports = {
  schemas,
  validate,
  validateFn,
};
