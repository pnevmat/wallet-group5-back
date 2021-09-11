const Budgets = require("../repositories/budgets");
const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const { planBudget } = require("..//helpers/operationsBudget");
const { v4: uuidv4 } = require("uuid");

const getBudgets = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const budgets = await Budgets.getPlanBudgetsByDate(
            userId,
            req.body
        );
        console.log(budgets)
        // budgets.sort(function (a, b) {
        //     return new Date(b.date).getTime() - new Date(a.date).getTime();
        // })
        if (budgets.length !== 0) {
            const budget = planBudget(budgets);
            return res.json({
                status: "success",
                code: HttpCode.OK,
                data: { budgets, budget },
            });
        }
    } catch (error) {
        next(error);
    }
};

const addBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const budget = await Budgets.addBudget(userId, req.body);
        if (budget) {
            return res
                .status(HttpCode.CREATED)
                .json({ status: "success", code: HttpCode.CREATED, budget });
        }
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
    } catch (error) {
        next(error);
    }
};

const removeBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
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