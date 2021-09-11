const Joi = require("joi");
const mongoose = require("mongoose");
const { HttpCode } = require("../../../helpers/constants");

const schemaCreateBudget = Joi.object({
    date: Joi.date().required(),
    amount: Joi.number().required(),
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
    validationCreateBudget: (req, res, next) => {
        return validate(schemaCreateBudget, req.body, next);
    },
};