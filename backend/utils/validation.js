const Joi = require('joi');

const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*)',
  });

const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: passwordSchema,
    full_name: Joi.string().min(2).max(100).required()
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  return schema.validate(data);
};

const validatePasswordReset = (data) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    password: passwordSchema
  });

  return schema.validate(data);
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordReset
};