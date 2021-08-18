const Users = require("../repositories/users");
const { randomColor, randomNums } = require("../helpers/oprationsTracsactions");

// const updateBalance = async (userId, transaction) => {
//     const user = await Users.findById(userId);
//     let updatedBalance = user.balance;
//     const amount = Number(transaction.amount);

//     if (transaction.type === 'cost') {
//         updatedBalance -= amount;
//     } else if (transaction.type === 'income') {
//         updatedBalance += amount;
//     } else {
//         throw new Error('Incorrect transaction type');
//     }
//     return await Users.updateUserBalance(userId, updatedBalance);

// };

const updateBalance = async (userId, transaction) => {
    const user = await Users.findById(userId);
    let updatedBalance = user.balance;
    const balance = Number(transaction.balance);
    updatedBalance = balance;
    return await Users.updateUserBalance(userId, updatedBalance);

};

const updateCategory = async (userId, transaction) => {
    const user = await Users.findById(userId);
    const userCategory = user.category;
    const transactionCategory = transaction.category;
    const newTransactionCategory = transactionCategory.charAt(0).toUpperCase() + transactionCategory.slice(1);
    const category = userCategory.map(el => el.name).find(name => name == newTransactionCategory);
    if (category) {
        userCategory;
    } else if (transaction.type === "cost") {
        userCategory.push({ name: newTransactionCategory, color: randomColor(randomNums(0, 100)) });
    }
    return Users.updateUserCategory(userId, userCategory);
}

module.exports = {
    updateBalance,
    updateCategory,
}

