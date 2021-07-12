const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findByName = async (name) => {
  return await User.findOne({ name });
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateUserBalance = async (id, balance) => {
  return await User.updateOne({ _id: id }, { balance });
};

const updateUserCategory = async (id, category) => {
  return await User.updateOne({ _id: id }, { category });
};

module.exports = {
  findById,
  findByEmail,
  findByName,
  create,
  updateToken,
  updateUserBalance,
  updateUserCategory,
};
