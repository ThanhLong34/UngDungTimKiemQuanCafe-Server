const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router.get("/", UserController.getList);
router.get("/:id", UserController.findById);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/:id/addFavouriteById", UserController.addFavouriteById);
router.post("/:id/removeFavouriteById", UserController.removeFavouriteById);
router.put("/:id/updatePasswordById", UserController.updatePasswordById);
router.put("/:id/updateFavouritesById", UserController.updateFavouritesById);
router.put("/:id/upgradeById", UserController.upgradeById);
router.delete("/:id", UserController.deleteById);

module.exports = router;
