const Transaction = require("../model/transaction");
const UpdateDataUser = require("../helpers/updateDataUser");
const { updateStartDate, updateEndDate, getMonthFromString } = require("../helpers/updateDate");
const { getLastPrevTransactionBalace, calcNewBalance, recalculateBalance, recalculateUpdateBalance } = require("../helpers/operationsTracsactions");

const getTransactions = async (userId, query) => {
    const {
        sortBy,
        sortByDesc,
        filter,
        limit = 20,
        offset = 0,
    } = query;
    const optionsSearch = { owner: userId };
    const results = await Transaction.paginate(optionsSearch, {
        limit,
        offset,
        sort: {
            ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
            ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
        },
        select: {
            ...(filter ? filter.split("|").join(" ") : ""),
        },
        populate: { path: "owner", select: "name email balance" },
    });
    return results;
};

const getTransactionById = async (userId, transactionId) => {
    const result = await Transaction.find({
        _id: transactionId,
        owner: userId,
    }).populate({
        path: "owner",
        select: "name email balance",
    });
    return result;
};

const getAllTransactions = async (userId) => {
    const result = await Transaction.find({
        owner: userId,
    }).populate({
        path: "owner",
        select: "_id",
    })
        .sort({ date: -1 });
    return result;
}

const getTransactionsByDate = async (userId, body) => {
  const { month, year } = body;
  const monthIntger = getMonthFromString(month);
  const startDate = updateStartDate(monthIntger, year);
  const endDate = updateEndDate(monthIntger, year).toISOString();

  const result = await Transaction.find({
    date: { $gte: startDate, $lt: endDate },
    owner: userId,
  }).populate({
    path: "owner",
    select: "name",
  });

  return result;
};

const addTransaction = async (userId, body) => {
    const prevBalance = await getLastPrevTransactionBalace(body.date, userId);
    const newBalance = await calcNewBalance(prevBalance, body);
    const result = await Transaction.create({
        owner: userId,
        ...body,
        balance: newBalance
    });
    await recalculateBalance(body.date, body, userId, false);

    return result;
};


const updateTransactionBalance = async ({ owner: userId, balance }) => {
    const result = await Transaction.updateOne({ owner: userId }, { balance });
    return result;
};

const removeTransaction = async (userId, transactionId) => {
    const transaction = await Transaction.findByIdAndRemove({
        owner: userId,
        _id: transactionId,
    }).populate({
        path: "owner",
        select: "name email balance",
    });

    const lastTransactions = await Transaction.find({
        date: { $gte: transaction.date, $lt: new Date() },
        owner: userId,
    }).sort({ date: -1 }).limit(1);

    if (lastTransactions.length !== 0) {
        await recalculateBalance(transaction.date, transaction, userId, false, 'del');
        await UpdateDataUser.updateBalance(userId, lastTransactions, transaction.amount);
    } else {
        await recalculateBalance(transaction.date, 0, userId, false, 'del');
        await UpdateDataUser.updateBalance(userId, lastTransactions.length ? lastTransactions : [transaction], transaction.amount);
    }

    return transaction;
};

const updateTransaction = async (userId, transactionId, body) => {
	const transaction = await Transaction.findOneAndUpdate(
		{_id: transactionId, owner: userId},
		{ ...body },
		{new: true}
	).populate({
		path: "owner",
		select: "name email balance",
	});

	const allTransactions = await Transaction.find({
		owner: userId,
	}).sort({ date: 'asc' });

	if (allTransactions.length !== 0) {
		const updatedTransactions = await recalculateUpdateBalance(allTransactions);
		const difAmmount = updatedTransactions[updatedTransactions.length - 1].balance - allTransactions[allTransactions.length - 1].balance;
		await UpdateDataUser.updateBalance(userId, [allTransactions[allTransactions.length - 1]], difAmmount);
	}
    
  return transaction;
};

module.exports = {
    getTransactions,
    getTransactionById,
    addTransaction,
    removeTransaction,
    updateTransaction,
    getTransactionsByDate,
    getAllTransactions,
    updateTransactionBalance,
};