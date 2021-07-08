const Joi = require("joi");
const mongoose = require("mongoose");

const schemaCreateTransaction = Joi.object({
  type: Joi.string().required().message({ "string.pattern.base": `Type transaction be must only income or cost` }),
  amount: Joi.number().required(),
  comments: Joi.string().optional(),
  category: Joi.array().required(),
});



module.exports = {
  validationCreateTransaction: (req, res, next) => {
    return validate(schemaCreateTransaction, req.body, next);
  },
};
