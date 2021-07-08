const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/transactions");
const guard = require("../../../helpers/guard");


router.use((req, res, next) => {
  console.log(req.url);
  next();
});

router
  .get("/", guard, ctrl.getTransactions);
router
  .post("/add", guard, ctrl.addTransaction);


module.exports = router;
