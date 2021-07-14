const Joi = require("joi");
const mongoose = require("mongoose");
const { HttpCode } = require("../../../helpers/constants");

const schemaCreateTransaction = Joi.object({
  date: Joi.string().required(),
  type: Joi.string().required(),
  amount: Joi.number().required(),
  comments: Joi.string().optional(),
  category: Joi.string().pattern(new RegExp("^[а-яА-ЯёЁa-zA-Z0-9 ]+$")).optional(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: err.message.replace(/"/g, ""),
    });
  }
};

module.exports = {
  validationCreateTransaction: (req, res, next) => {
    return validate(schemaCreateTransaction, req.body, next);
  },
};
