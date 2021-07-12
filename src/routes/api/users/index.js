const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");

const {
  validationCreateUser,
  validationLoginUser,
} = require("./validation");

router.post("/register", validationCreateUser, ctrl.register);
router.post("/login", validationLoginUser, ctrl.login);
router.post("/logout", guard, ctrl.logout);
router.get("/getUserData", guard, ctrl.currentUser);
router.get("/balance", guard, ctrl.currentBalance);
router.get("/category", guard, ctrl.currentCategory);



module.exports = router;
