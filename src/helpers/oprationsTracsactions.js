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

const getCategories = (transactions) => {
    const categories = transactions.map((el) => ({ name: el.category, amount: el.amount }));
    return categories;
}

const concatArray = (array1, array2) => {
    let arr = []
    array1.forEach((elem) => {
        let amount = (typeof arr[elem.name] !== "undefined") ? arr[elem.name].amount + elem.amount : elem.amount;
        let color = (typeof arr[elem.name] !== "undefined") ? arr[elem.name].color = elem.color : elem.color;
        let row = { "amount": amount, "color": color }
        arr[elem.name] = Object.assign((arr[elem.name] || {}), row);
    })
    array2.map((item) => {
        return {
            name: item.name,
            amount: (typeof arr[item.name] !== "undefined") ? arr[item.name].amount : 0,
            color: (typeof arr[item.name] !== "undefined") ? arr[item.name].color = item.color : "",
        };
    });
    return arr;
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
}