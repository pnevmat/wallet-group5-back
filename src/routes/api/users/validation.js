const Joi = require("joi");
const mongoose = require("mongoose");

const schemaCreateUser = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]+$")).required(),
  repeatPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]+$")).required(),
});


const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ""),
    });
  }
};

module.exports = {
  validationCreateUser: (req, res, next) => {
    return validate(schemaCreateUser, req.body, next);
  },
  validationLoginUser: (req, res, next) => {
    return validate(schemaLoginUser, req.body, next);
  },
};
