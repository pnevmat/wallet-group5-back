const Transaction = require("../model/transaction");
const { v4: uuidv4 } = require("uuid");


const incomeSum = (transactions) => {
    const incomeArr = transactions.filter(el => el.type == "income");
    const income = incomeArr.reduce(
        (total, el) => (total += parseInt(el.amount)),
        0
    );
    return income;
}

const costSum = (transactions) => {
    const costArr = transactions.filter(el => el.type == "cost");
    const cost = costArr.reduce(
        (total, el) => (total += parseInt(el.amount)),
        0
    );
    return cost;
}

const getLastTransactionsBalance = async (date, userId) => {
    const transaction = await Transaction.find({
        date: {  $gte: date, $lt: new Date() },
        owner: userId,
    }).sort({ date: -1 }).limit(1);
		console.log('Last transaction: ', transaction);
    if (!transaction || transaction.length === 0) {
        return 0;
    } else return transaction[0].balance;
}

const getLastPrevTransactionBalace = async (date, userId) => {
	const transaction = await Transaction.find({
		date: {  $lt: date },
		owner: userId,
	}).sort({ date: -1 }).limit(1);
	console.log('Last prev transaction: ', transaction);
	if (!transaction || transaction.length === 0) {
		return 0;
	} else return transaction[0].balance;
}

const calcNewBalance = (balance, body) => {
    const amount = Number(body.amount);
    const type = body.type;
    if (type === "income") {
        return parseInt(balance + amount);
    } else if (type === "cost") {
        return parseInt(balance - amount);
    } else throw new Error('Incorrect transaction type');
}

const calcUpdateBalance = (currentEl, body, updateAmount, typeChange, prevDate, prevEl) => {
	const type = body.type;
	if (updateAmount === 0) return currentEl.balance;

	if (typeChange === 'income' || typeChange === 'cost') {
		return parseInt(currentEl.balance + updateAmount);
	};

	if (body.date !== prevDate) {
		if (prevEl && currentEl.balance <= prevEl.balance - currentEl.amount + updateAmount) {
			return parseInt(currentEl.balance);
		}
		return parseInt(currentEl.balance + updateAmount);
	};

	if (type === "income") {
		return parseInt(currentEl.balance - updateAmount);
	} else if (type === "cost") {
		return parseInt(currentEl.balance + updateAmount);
	} else throw new Error('Incorrect transaction type');
};

const calcDellBalance = (balance, transaction) => {
    const amount = Number(transaction.length ? transaction[0].amount : transaction.amount);
    const type = transaction.length ? transaction[0].type : transaction.type;
    if (type === "income") {
        return parseInt(balance - amount);
    } else if (type === "cost") {
        return parseInt(balance + amount);
    } else throw new Error('Incorrect transaction type');
}

const recalculateBalance = async (
    date,
    actionTransaction,
    userId,
    isLatestTransaction,
		type,
		difAmount,
		typeChange,
		prevDate
) => {
    let balance = 0;
    const transactions = await Transaction.find({
        date: isLatestTransaction ? { $gte: date } : { $gt: date },
        owner: userId,
    }).sort({ date: 'asc' })
		console.log('Recalc balace transactions: ', transactions);
    await transactions.forEach(async (el, i) => {
        balance = type === 'del' ? calcDellBalance(el.balance, actionTransaction) : type === 'update' ? calcUpdateBalance(el, actionTransaction, difAmount, typeChange, prevDate, transactions[i - 1]) : calcNewBalance(el.balance, actionTransaction);
				console.log('Balance in recalc balance: ', balance);
        await Transaction.updateOne(
            { _id: el.id },
            { balance: balance },
            function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Success update')
                }
            }
        )
    })
}

const recalculateUpdateBalance = async (
	transactions,
) => {
	let balance = 0;
	const updatedTransactions = transactions.map((transaction, i) => {
		if (i === 0 && transaction.amount !== transaction.balance) {
			const newBalance = transaction.type === 'income' ? transaction.amount : -transaction.amount;
			balance = transaction.type === 'income' ? transaction.amount : -transaction.amount;

			return {...transaction, balance: newBalance};
		};

		if (i !== 0) {
			if (transaction.type === 'income' && transaction.balance !== balance + transaction.amount) {
				const newBalance = balance + transaction.amount;
				balance = balance + transaction.amount;

				return {...transaction, balance: newBalance};
			};

			if (transaction.type === 'cost' && transaction.balance !== balance - transaction.amount) {
				const newBalance = balance - transaction.amount;
				balance = balance - transaction.amount;

				return {...transaction, balance: newBalance};
			};
		};
		balance = transaction.balance;
		console.log('Balance in recalc balance: ', balance);
		return transaction;
	});

	await transactions.forEach(async (el, i) => {
			// balance = 0;
			// calcUpdateBalance(el, actionTransaction, difAmount, typeChange, prevDate, transactions[i - 1]);
		if (el.balance !== updatedTransactions[i].balance) {
			await Transaction.updateOne(
				{ _id: el.id },
				{ balance: updatedTransactions[i].balance },
				function (err) {
					if (err) {
						console.log(err)
					} else {
						console.log('Success update')
					}
				}
			)
		}
	})
	return updatedTransactions;
}

const recalculateDellBalance = async (
    date,
    currentBalance,
    userId,
    isLatestTransaction
) => {
    let balance = currentBalance
    const transactions = await Transaction.find({
        date: isLatestTransaction ? { $gte: date } : { $gt: date },
        owner: userId,
    }).sort({ date: 'asc' })

    await transactions.forEach(async (el) => {
        balance = calcDellBalance(balance, el)
        await Transaction.updateOne(
            { _id: el.id },
            { balance: balance },
            function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Success update')
                }
            }
        )
    })
}

const getCurrentBalance = async (date, currentBalance, userId, isLastTransaction) => {
    let balance = currentBalance;
    const transactions = await Transaction.find({
        owner: userId,
        date: isLastTransaction ? { $gte: date } : { $gt: date },
    });
}


const getCategories = (transactions) => {
    const categories = transactions.filter((el) => el.type == "cost").map((el) => ({ "name": el.category, "amount": el.amount }));
    return categories;
}


const arrayClone = (src) => {
    let dest = (src instanceof Array) ? [] : {};
    Object.setPrototypeOf(dest, Object.getPrototypeOf(src));
    Object.getOwnPropertyNames(src).forEach(name => {
        const descriptor = Object.getOwnPropertyDescriptor(src, name);
        Object.defineProperty(dest, name, descriptor);
    });
    return dest;
}


const concatArray = (array1, array2) => {
    let arr = []

    array1.map((elem) => {
        let amount = (typeof arr[elem.name] !== "undefined") ? arr[elem.name].amount + elem.amount : elem.amount;
        let color = (typeof arr[elem.name] !== "undefined") ? arr[elem.name].color = elem.color : elem.color;
        let row = { id: uuidv4(), name: elem.name, amount: amount, color: color };
        arr[elem.name] = Object.assign((arr[elem.name] || {}), row);
    })
    array2.map((item) => {
        return {
            amount: (typeof arr[item.name] !== "undefined") ? arr[item.name].amount : 0,
            color: (typeof arr[item.name] !== "undefined") ? arr[item.name].color = item.color : "",
        };
    });

    return arrayClone(Object.values(arr));
}


const getColorsCategories = (categories) => {
    const colors = categories.map((el) => el);
    return colors;
}

const randomNums = (min, max) => {
    let arr = [];
    for (let i = 0; i < max; i++) {
        x = Math.floor(Math.random() * (max - min + 1)) + min;
        if (arr.includes(x) == true) {
            return;
        }
        else {
            arr.push(x);
        }
        return arr;
    }
}

const randomColor = (brightness) => {
    function randomChannel(brightness) {
        let r = 255 - brightness;
        let n = 0 | ((Math.random() * r) + brightness);
        let s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}



module.exports = {
    incomeSum,
    costSum,
    getCategories,
    randomColor,
    randomNums,
    getColorsCategories,
    concatArray,
    getLastTransactionsBalance,
		getLastPrevTransactionBalace,
    calcNewBalance,
		calcUpdateBalance,
    recalculateBalance,
    getCurrentBalance,
    calcDellBalance,
    recalculateDellBalance,
		recalculateUpdateBalance
}