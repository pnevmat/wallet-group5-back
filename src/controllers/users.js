const Users = require("../repositories/users");
const {createCategory, editCategory, deleteCategory} = require("../helpers/updateDataUser")
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY

const register = async (req, res, next) => {
  try {
    const userEmail = await Users.findByEmail(req.body.email);
    if (userEmail) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Такой email уже зарегистрирован",
      });
    }

    const { id, name, email, avatarURL, balance, category } = await Users.create(
      req.body
    );
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await Users.updateToken(id, token);
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      user: { id, name, email, avatarURL, balance, category, token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Не верный логин или пароль",
      });
    }
    const id = user.id;
    const { email, name, balance, avatarURL } = user;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await Users.updateToken(id, token);
    return res.json({ status: "OK", code: HttpCode.OK, data: { token, id, email, name, balance, avatarURL } });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({ status: "No Content" });
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { name, email, balance, category, avatarURL } = await Users.findById(id);
    return res.status(HttpCode.OK).json({
      status: "OK",
      code: HttpCode.OK,
      user: { name, email, balance, category, avatarURL },
    });
  } catch (error) {
    next(error);
  }
};

const currentBalance = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { balance } = await Users.findById(id);
    return res.status(HttpCode.OK).json({
      status: "OK",
      code: HttpCode.OK,
      user: { balance },
    });
  } catch (error) {
    next(error);
  }
};

const currentCategory = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { category } = await Users.findById(id);

    return res.status(HttpCode.OK).json({
      status: "OK",
      code: HttpCode.OK,
      user: { categories: category },
    });
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
	const email = req.body.email;
	const category = req.body.category;
	const user = await Users.findByEmail(email);

	if (!user) {
		return res.status(HttpCode.CONFLICT).json({
			status: "error",
			code: HttpCode.CONFLICT,
			message: "User not found",
		});
	}
	
	const categoryDb = await createCategory(user.id, category);

	return res.status(HttpCode.CREATED).json({
		status: "success",
		code: HttpCode.CREATED,
		category: categoryDb
	});
}

const updateCategory = async (req, res, next) => {
	const email = req.body.email;
	const category = req.body.category;
	const user = await Users.findByEmail(email);

	if (!user) {
		return res.status(HttpCode.CONFLICT).json({
			status: "error",
			code: HttpCode.CONFLICT,
			message: "User not found",
		});
	}

	const editedCategoryDb = await editCategory(user.id, category);

	if (!editedCategoryDb) {
		return res.status(HttpCode.CONFLICT).json({
			status: "error",
			code: HttpCode.CONFLICT,
			message: "Category not found",
		});
	}

	return res.status(HttpCode.OK).json({
		status: "success",
		code: HttpCode.OK,
		category: editedCategoryDb
	});
}

const removeCategory = async (req, res, next) => {
	const email = req.query.email;
	const categoryId = req.query.id;
	const user = await Users.findByEmail(email);
	
	if (!user) {
		return res.status(HttpCode.CONFLICT).json({
			status: "error",
			code: HttpCode.CONFLICT,
			message: "User not found",
		});
	}

	const removedCategory = await deleteCategory(user.id, categoryId);

	if (!removedCategory) {
		return res.status(HttpCode.CONFLICT).json({
			status: "error",
			code: HttpCode.CONFLICT,
			message: "Category not found",
		});
	}

	return res.status(HttpCode.OK).json({
		status: "success",
		code: HttpCode.OK,
		category: removedCategory
	});
}

module.exports = {
  register,
  login,
  logout,
  currentUser,
  currentBalance,
  currentCategory,
	addCategory,
	updateCategory,
	removeCategory
};
