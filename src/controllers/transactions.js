const Transactions = require("../repositories/transactions");
const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const UpdateDataUser = require("../helpers/updateDataUser");
const { incomeSum, costSum, getCategories, concatArray } = require("../helpers/operationsTracsactions");
const { v4: uuidv4 } = require("uuid");


const getTransactions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { docs: transactions, ...rest } = await Transactions.getTransactions(
            userId,
            req.query
        );
        transactions.sort(function (a, b) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
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
            await UpdateDataUser.updateBalance(userId, [transaction]);
            return res
                .status(HttpCode.CREATED)
                .json({ status: "success", code: HttpCode.CREATED, transaction });
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
        const { category, balance } = req.user;
        const transactions = await Transactions.getTransactionsByDate(
            userId,
            req.body,
        );
        const incomeBalance = incomeSum(transactions);
        const costBalance = costSum(transactions);
        const costTransactions = transactions.filter(el => el.type === "cost");
        if (costTransactions.length !== 0) {
            const categoriesTransactions = getCategories(transactions);
            const newCategories = concatArray(categoriesTransactions, category);
            return res.json({
                status: "success",
                code: HttpCode.OK,
                data: { balance, incomeBalance, costBalance, categories: [...newCategories] },
            });
        } else {
            const categoriesWithNull = category.map((elem) => {
                return {
                    id: uuidv4(),
                    name: elem.name,
                    amount: 0,
                    color: elem.color,
										type: elem.type,
                };
            }).filter(el => el.type === "cost");
            return res.json({
                status: "success",
                code: HttpCode.OK,
                data: { balance, incomeBalance, costBalance, categories: [...categoriesWithNull] },
            });
        }
    } catch (error) {
        next(error)
    }
}

const getAllStatisticTransactions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { category, balance } = req.user;
        const allTransactions = await Transactions.getAllTransactions(userId);
        const incomeBalance = incomeSum(allTransactions);
        const costBalance = costSum(allTransactions);
        const costTransactions = allTransactions.filter(el => el.type === "cost");
        if (costTransactions.length !== 0) {
            const categoriesTransactions = getCategories(allTransactions);
            const newCategories = concatArray(categoriesTransactions, category);
            return res.json({
                status: "success",
                code: HttpCode.OK,
                data: { balance, incomeBalance, costBalance, categories: [...newCategories] },
            });
        } else {
            const categoriesWithNull = category.map((elem) => {
                return {
                    id: uuidv4(),
                    name: elem.name,
                    amount: 0,
                    color: elem.color,
										type: elem.type,
                };
            }).filter(el => el.type === "cost");
            return res.json({
                status: "success",
                code: HttpCode.OK,
                data: { balance, incomeBalance, costBalance, categories: [...categoriesWithNull] },
            });
        }
    } catch (error) {
        next(error)
    }
}

const updateTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
				const transactionId = req.params.transactionId;
				
        const transaction = await Transactions.updateTransaction(
            userId,
            transactionId,
            req.body
        );

        if (transaction) {
            return res.json({
                status: "success",
                code: HttpCode.OK,
                transaction,
            });
        }
        return res.status(HttpCode.NOT_FOUND).json({
            status: "error",
            code: HttpCode.NOT_FOUND,
            message: "Not found",
        });
    } catch (error) {
        next(error);
    }
};

const removeTransaction = async (req, res, next) => {
    try {
        const userEmail = req.query.email;
        const transactionId = req.params.transactionId;
				const user = await Users.findByEmail(userEmail);
        const transaction = await Transactions.removeTransaction(user.id, transactionId);

        if (transaction) {
            return res.json({
                status: "success",
                code: HttpCode.OK,
								transaction: transaction
            });
        }
        return res.status(HttpCode.NOT_FOUND).json({
            status: "error",
            code: HttpCode.NOT_FOUND,
            message: "Not found",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTransactions,
    addTransaction,
    getStatisticTransactions,
    getAllStatisticTransactions,
    updateTransaction,
    removeTransaction,
};