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
    const categories = transactions.map((el) => ({ [el.category]: el.amount }));
    return categories;
}

module.exports = {
    incomeSum,
    costSum,
    getCategories,
}