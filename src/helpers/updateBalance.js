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


module.exports = {
    updateBalance,
}

