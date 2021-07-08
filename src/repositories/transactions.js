const { query } = require("express");
const Transaction = require("../model/transaction");

const getTransactions = async (userId, query) => {
    const {
        sortBy,
        sortByDesc,
        filter,
        limit = 10,
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
    const result = await Transaction.findOne({
        _id: transactionId,
        owner: userId,
    }).populate({
        path: "owner",
        select: "name email balance",
    });
    return result;
};

const addTransaction = async (userId, body) => {
    const result = await Transaction.create({ owner: userId, ...body });
    return result;
};

const removeTransaction = async (userId, transactionId) => {
    const result = await Transaction.findOneAndRemove({
        _id: transactionId,
        owner: userId,
    }).populate({
        path: "owner",
        select: "name email balance",
    });
    return result;
};

const updateTransaction = async (userId, transactionId, body) => {
    const result = await Contact.findOneAndUpdate(
        { transactionId, owner: userId },
        body,
        {
            new: true,
        }
    ).populate({
        path: "owner",
        select: "name email balance",
    });
    return result;
};

module.exports = {
    getTransactions,
    getTransactionById,
    addTransaction,
    removeTransaction,
    updateTransaction,
};