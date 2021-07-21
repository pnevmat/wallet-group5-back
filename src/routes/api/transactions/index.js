const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/transactions");
const guard = require("../../../helpers/guard");

const {
  validationCreateTransaction,
} = require("./validation");

router.use((req, res, next) => {
  console.log(req.url);
  next();
});

router
  .get("/", guard, ctrl.getTransactions);
router
  .post("/add", guard, validationCreateTransaction, ctrl.addTransaction);
router
  .get("/statistics", guard, ctrl.getAllStatisticTransactions)
  .post("/statistics", guard, ctrl.getStatisticTransactions);
router
  .put("/:transactionId", guard, ctrl.updateTransaction)
  .delete("/:transactionId", guard, ctrl.removeTransaction);


module.exports = router;
