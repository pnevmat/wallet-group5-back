const Joi = require("joi");
const { HttpCode } = require("../../../helpers/constants");

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

const schemaAddCategory = Joi.object({
	email: Joi.string().email().required(),
	category: Joi.object({
		id: Joi.string(),
		type: Joi.string().required(),
		name: Joi.string().required(),
		color: Joi.string()
	})
})

const schemaEditCategory = Joi.object({
	email: Joi.string().email().required(),
	category: Joi.object({
		id: Joi.string().required(),
		type: Joi.string().required(),
		name: Joi.string().required(),
		color: Joi.string().required()
	})
})


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
  validationCreateUser: (req, res, next) => {
    return validate(schemaCreateUser, req.body, next);
  },
  validationLoginUser: (req, res, next) => {
    return validate(schemaLoginUser, req.body, next);
  },
	validationAddCategory: (req, res, next) => {
		return validate(schemaAddCategory, req.body, next);
	},
	validationEditCategory: (req, res, next) => {
		return validate(schemaEditCategory, req.body, next);
	}
};
