const express = require("express");
const router = express.Router();
const userAccountController = require("../controllers/userAccount.controller");

router.get("/", userAccountController.getAll);
router.get("/:id", userAccountController.findById);
router.post("/register", userAccountController.register);
router.post("/login", userAccountController.login);
router.put("/:id/updatePasswordById", userAccountController.updatePasswordById);
router.delete("/:id", userAccountController.deleteById);

module.exports = router;
