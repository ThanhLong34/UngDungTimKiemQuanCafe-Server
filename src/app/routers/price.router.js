const express = require("express");
const router = express.Router();
const priceController = require("../controllers/price.controller");

router.get("/", priceController.getList);
router.get("/:id", priceController.findById);
router.post("/", priceController.create);
router.put("/:id", priceController.updateById);
router.delete("/:id", priceController.deleteById);

module.exports = router;
