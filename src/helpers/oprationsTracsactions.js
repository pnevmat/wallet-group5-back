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
        date: { $lt: date },
        owner: userId,
    })
        .sort({ date: -1 })
        .limit(1)
    if (!transaction || transaction.length === 0) {
        return 0;
    } else return transaction[0].balance;
}



const calcNewBalance = (balance, body) => {
    const amount = body.amount;
    const type = body.type;
    if (type === "income") {
        return parseInt(balance + amount);
    } else if (type === "cost") {
        return parseInt(balance - amount);
    } else throw new Error('Incorrect transaction type');
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
    calcNewBalance,
}