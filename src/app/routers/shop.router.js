const express = require("express");
const router = express.Router();
const ShopController = require("../controllers/shop.controller");

router.get("/", ShopController.getList);
router.get("/:id", ShopController.findById);
router.post("/", ShopController.create);
router.put("/:id", ShopController.updateById);
router.delete("/:id", ShopController.deleteById);

module.exports = router;
