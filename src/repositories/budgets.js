const Budget = require("../model/budget");
const { updateStartDate, updateEndDate, getMonthFromString } = require("../helpers/updateDate");
const { planBudget } = require("..//helpers/operationsBudget");

const getBudgetById = async (userId, budgetId) => {
    const result = await Budget.findOne({
        _id: budgetId,
        owner: userId,
    }).populate({
        path: "owner",
        select: "name email",
    });
    return result;
};

const getPlanBudgetsByDate = async (userId, body) => {
    const { month, year } = body;
		console.log('Month: ', month);
    const monthIntger = getMonthFromString(month);
		console.log('Numeric month: ', monthIntger);
    const startDate = updateStartDate(monthIntger, year);
		console.log('Start date: ', startDate);
    const endDate = updateEndDate(monthIntger, year).toISOString();
    const result = await Budget.find({
        date: { $gte: startDate, $lt: endDate },
        owner: userId,
    }).populate({
        path: "owner",
        select: "name",
    });

    return result;
};


const addBudget = async (userId, body) => {
    const result = await Budget.create({
        owner: userId,
        ...body,
    });
    return result;
};

const updateBudget = async (userId, body) => {
	const result = await Budget.findOneAndUpdate(
		{
			_id: body.id,
			owner: userId,
		},
		{ ...body },
		{new: true}
	);

	return result;
}

const deleteBudget = async (userId, budgetId) => {
	const budget = await Budget.findByIdAndRemove({
		owner: userId,
		_id: budgetId,
	}).populate({
		path: "owner",
		select: "name email balance",
	});

	return budget;
}

module.exports = {
    getBudgetById,
    getPlanBudgetsByDate,
    addBudget,
		updateBudget,
		deleteBudget,
}