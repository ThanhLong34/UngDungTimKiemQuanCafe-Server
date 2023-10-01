const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.getList);
router.get("/:id", userController.findById);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/:id/updatePasswordById", userController.updatePasswordById);
router.put("/:id/updateFavoritesById", userController.updateFavoritesById);
router.put("/:id/upgradeById", userController.upgradeById);
router.delete("/:id", userController.deleteById);

module.exports = router;
