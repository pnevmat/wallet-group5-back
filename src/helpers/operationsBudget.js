const Budget = require("../model/budget");
const { v4: uuidv4 } = require("uuid");

const planBudget = (budgets) => {
    const total = budgets.reduce(
        (total, el) => (total += parseInt(el.planAmount)), 0);

    return total;
};

const calcTotal = (budgets) => {
	const total = budgets.reduce(
		(total, el) => (total += parseInt(el.amount)), 0);

	return total;
}



module.exports = {
    planBudget,
		calcTotal,
}