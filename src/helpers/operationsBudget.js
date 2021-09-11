const Budget = require("../model/budget");
const { v4: uuidv4 } = require("uuid");

const planBudget = (budgets) => {
    const budget = budgets.reduce(
        (total, el) => (total += parseInt(el.amount)), 0);
    return budget;
};



module.exports = {
    planBudget,
}