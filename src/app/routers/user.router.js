const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.getList);
router.get("/:id", userController.findById);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/:id/addFavouriteById", userController.addFavouriteById);
router.post("/:id/removeFavouriteById", userController.removeFavouriteById);
router.put("/:id/updatePasswordById", userController.updatePasswordById);
router.put("/:id/updateFavouritesById", userController.updateFavouritesById);
router.put("/:id/upgradeById", userController.upgradeById);
router.delete("/:id", userController.deleteById);

module.exports = router;
