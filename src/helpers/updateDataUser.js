const Users = require("../repositories/users");

const updateBalance = async (userId, transaction) => {
    const user = await Users.findById(userId);
    let updatedBalance = user.balance;
    const amount = Number(transaction.amount);

    if (transaction.type === 'cost') {
        updatedBalance -= amount;
    } else if (transaction.type === 'income') {
        updatedBalance += amount;
    } else {
        throw new Error('Incorrect transaction type');
    }
    return Users.updateUserBalance(userId, updatedBalance);

};

const updateCategory = async (userId, transaction) => {
    const user = await Users.findById(userId);
    let userCategory = user.category;
    const transactionCategory = transaction.category;
    const newTransactionCategory = transactionCategory.charAt(0).toUpperCase() + transactionCategory.slice(1);
    let category = userCategory.find(item => item == newTransactionCategory);
    if (category) {
        userCategory;
    } else {
        userCategory.push(newTransactionCategory);
    }
    return Users.updateUserCategory(userId, userCategory);
}

module.exports = {
    updateBalance,
    updateCategory,
}

