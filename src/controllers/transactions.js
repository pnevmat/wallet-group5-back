const Transactions = require("../repositories/transactions");
const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const UpdateDataUser = require("../helpers/updateDataUser");
const { incomeSum, costSum, getCategories, getColorsCategories, concatArray } = require("../helpers/oprationsTracsactions");


const getTransactions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { docs: transactions, ...rest } = await Transactions.getTransactions(
            userId,
            req.query
        );
        return res.json({
            status: "success",
            code: HttpCode.OK,
            data: { transactions, ...rest },
        });
    } catch (error) {
        next(error);
    }
};

const addTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const transaction = await Transactions.addTransaction(userId, req.body);

        if (transaction) {
            await UpdateDataUser.updateBalance(userId, transaction);
            await UpdateDataUser.updateCategory(userId, transaction);
            return res
                .status(HttpCode.CREATED)
                .json({ status: "success", code: HttpCode.CREATED, data: { transaction } });
        }
        return res.status(HttpCode.BAD_REQUEST).json({
            status: "error",
            code: HttpCode.BAD_REQUEST,
            message: "missing required name field",
        });
    } catch (error) {
        next(error);
    }
};

const getStatisticTransactions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { category } = req.user;
        const transactions = await Transactions.getTransactionsByDate(
            userId,
            req.body,
        );
        const incomeBalance = incomeSum(transactions);
        const costBalance = costSum(transactions);
        const categoriesTransactions = getCategories(transactions);
        const newCategories = concatArray(categoriesTransactions, category);
        return res.json({
            status: "success",
            code: HttpCode.OK,
            data: { incomeBalance, costBalance, categories: { ...newCategories } },
        });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getTransactions,
    addTransaction,
    getStatisticTransactions,
};