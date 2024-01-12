const Users = require("../repositories/users");
const { randomColor, randomNums } = require("./operationsTracsactions");
const { nanoid } = require("nanoid");

const updateBalance = async (userId, transaction, delAmmount) => {
    const user = await Users.findById(userId);
    let updatedBalance = user.balance;

    if (transaction.length !== 0) {
        const balance = Number(delAmmount ? transaction[0].balance + delAmmount : transaction[0].balance);
        updatedBalance = balance;
        return await Users.updateUserBalance(userId, updatedBalance);
    } else {
        const balance = 0;
        updatedBalance = balance;
        return await Users.updateUserBalance(userId, updatedBalance);
    }

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

const createCategory = async (userId, category) => {
	const user = await Users.findById(userId);
	const userCategory = user.category;

	const categoriesByType = userCategory.filter(userCategory => userCategory.type === category.type);
	const machCategory = categoriesByType.find(typeCategory => typeCategory.name == category.name);

	const color = randomColor(randomNums(0, 100))
	console.log('Color: ', color);
	if (!machCategory) {
		userCategory.push({...category, color, id: nanoid() });
	}

	Users.updateUserCategory(userId, userCategory);

	return {...category, color, id: nanoid() }
}

const editCategory = async (userId, category) => {
	const user = await Users.findById(userId);
	const userCategory = user.category;

	const machCategory = userCategory.find(typeCategory => typeCategory.type === category.type && typeCategory.id === category.id);
	
	if (!machCategory) return false;

	const newUserCategory = [...userCategory.filter(cat => cat.id !== machCategory.id), {...machCategory, name: category.name}]

	Users.updateUserCategory(userId, newUserCategory);

	return {...machCategory, name: category.name};
}

const deleteCategory = async (userId, categoryId) => {
	const user = await Users.findById(userId);
	const userCategory = user.category;

	const foundCategory = userCategory.find(cat => cat.id === categoryId);
	const newUserCategory = userCategory.filter(cat => cat.id !== categoryId);

	Users.updateUserCategory(userId, newUserCategory);

	return foundCategory;
}

module.exports = {
    updateBalance,
    updateCategory,
		createCategory,
		editCategory,
		deleteCategory
}

