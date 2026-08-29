const Joi = require("joi");

const userJoiSchema = Joi.object({
  username: Joi.string().min(3).required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(10)
    .pattern(/^(?=.*[!@#$%^&*])/)
    .messages({
      "string.min": "Password must be at least 10 characters long",
      "string.pattern.base":
        "Password must contain at least one special character",
    })
    .required(),
});

const userUpdateJoiSchema = Joi.object({
  username: Joi.string().optional(),
  fullname: Joi.string().optional(),
  email: Joi.string().email().optional(),
});

const passwordUpdateJoiSchema = Joi.object({
  password: Joi.string().required(),
  newPassword: Joi.string()
    .min(10)
    .pattern(/^(?=.*[!@#$%^&*])/)
    .messages({
      "string.min": "Password must be at least 10 characters long",
      "string.pattern.base":
        "Password must contain at least one special character",
    })
    .required(),
});

module.exports = {
  userUpdateJoiSchema,
  userJoiSchema,
  passwordUpdateJoiSchema,
};
