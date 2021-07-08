const Transactions = require("../repositories/transactions");
const { HttpCode } = require("../helpers/constants");
const UpdateBalance = require("../helpers/updateBalance")

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
            await UpdateBalance.updateBalance(userId, transaction);
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

const getCategory = async (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getTransactions,
    addTransaction,
    getCategory,
};