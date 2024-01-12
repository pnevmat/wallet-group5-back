const Budgets = require("../repositories/budgets");
const {getTransactionsByDate} = require('../repositories/transactions');
const { planBudget, calcTotal } = require("..//helpers/operationsBudget");
const { HttpCode } = require("../helpers/constants");

const getBudgets = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const budgets = await Budgets.getPlanBudgetsByDate(userId, req.body);

			if (budgets.length === 0) {
				return res.json({
          status: "success",
          code: HttpCode.OK,
          data: { budget: {}, total: 0 },
        });
			};

			const transactions = await getTransactionsByDate(userId, req.body);

			const costTransactions = transactions.filter(t => t.type === 'cost');
			const mapedBudgetItems = budgets[0].budget.map(item => ({
				...item._doc,
				factAmount: calcTotal(costTransactions.filter(t => t.category === item.category))
			}));

			const newBudget = {id: budgets[0].id, date: budgets[0].date, budget: mapedBudgetItems};
			const budget = await Budgets.updateBudget(userId, newBudget);

      if (budget) {
        const total = planBudget(budget.budget);
        return res.json({
          status: "success",
          code: HttpCode.OK,
          data: { budget, total },
        });
      } else {
				return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
					status: "error",
					code: HttpCode.INTERNAL_SERVER_ERROR,
					message: "db connection error",
				});
			}
    } catch (error) {
      next(error);
    }
};

const addBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
				const date = new Date(req.body.date);
				const monthAndYear = {
					month: date.getMonth() + 1,
					year: date.getFullYear()
				};

				const transactions = await getTransactionsByDate(userId, monthAndYear);

				const costTransactions = transactions.filter(t => t.type === 'cost');
				const mapedBudgetItems = req.body.budget.map(item => ({
					...item,
					factAmount: calcTotal(costTransactions.filter(t => t.category === item.category))
				}));
				const newBudget = {...req.body, budget: mapedBudgetItems};

        const budget = await Budgets.addBudget(userId, newBudget);

        if (budget) {
					const total = planBudget(budget.budget);
            return res.status(HttpCode.CREATED).json({ 
							status: "success", 
							code: HttpCode.CREATED, 
							data: {budget, total} 
						});
        };

        return res.status(HttpCode.BAD_REQUEST).json({
            status: "error",
            code: HttpCode.BAD_REQUEST,
            message: "missing required name field",
        });
    } catch (error) {
        next(error);
    }
};

const updateBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
				const date = new Date(req.body.date);
				const monthAndYear = {
					month: date.getMonth() + 1,
					year: date.getFullYear()
				};

				const transactions = await getTransactionsByDate(userId, monthAndYear);

				const costTransactions = transactions.filter(t => t.type === 'cost');
				const mapedBudgetItems = req.body.budget.map(item => ({
					...item,
					factAmount: calcTotal(costTransactions.filter(t => t.category === item.category))
				}));
				const newBudget = {...req.body, budget: mapedBudgetItems};

				const budget = await Budgets.updateBudget(userId, newBudget);

				if (budget) {
					const total = planBudget(budget.budget);
					return res.status(HttpCode.OK).json({ 
						status: "success", 
						code: HttpCode.OK, 
						data: {budget, total} 
					});
				};

				return res.status(HttpCode.NOT_FOUND).json({
					status: "error",
					code: HttpCode.NOT_FOUND,
					message: "budget not found",
				});
				
    } catch (error) {
        next(error);
    }
};

const removeBudget = async (req, res, next) => {
    try {
      const userId = req.user.id;
			const {budgetId} = req.params;
			const budget = await Budgets.deleteBudget(userId, budgetId);

			if (budget) {
				return res.status(HttpCode.OK).json({ 
					status: "success", 
					code: HttpCode.OK, 
					budget 
				});
			}

			return res.status(HttpCode.NOT_FOUND).json({
				status: "error",
				code: HttpCode.NOT_FOUND,
				message: "budget not found",
			});
			
    } catch (error) {
      next(error);
    }
}

module.exports = {
    getBudgets,
    addBudget,
    updateBudget,
    removeBudget,
};