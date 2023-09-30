const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop.controller");

router.get("/", shopController.getList);
router.get("/:id", shopController.findById);
router.post("/", shopController.create);
router.put("/:id", shopController.updateById);
router.delete("/:id", shopController.deleteById);

module.exports = router;
