const express = require("express");
const router = express.Router();


router.use("/users", require("./users"));
router.use("/transactions", require("./transactions"));
router.use("/budgets", require("./budgets"));


module.exports = router;
