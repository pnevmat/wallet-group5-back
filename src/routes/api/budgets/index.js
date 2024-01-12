const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/budgets");
const guard = require("../../../helpers/guard");

const {
    validationCreateBudget,
} = require("./validation");

router.use((req, res, next) => {
  console.log(req.url);
  next();
});

router.post("/", guard, ctrl.getBudgets);
router.post("/add", guard, validationCreateBudget, ctrl.addBudget);
router.put("/:budgetId", guard, ctrl.updateBudget);
router.delete("/:budgetId", guard, ctrl.removeBudget);


module.exports = router;