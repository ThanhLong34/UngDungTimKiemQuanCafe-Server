const express = require("express");
const router = express.Router();
const PriceController = require("../controllers/price.controller");

router.get("/", PriceController.getList);
router.get("/:id", PriceController.findById);
router.post("/", PriceController.create);
router.put("/:id", PriceController.updateById);
router.delete("/:id", PriceController.deleteById);

module.exports = router;
