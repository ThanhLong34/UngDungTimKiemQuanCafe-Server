const express = require("express");
const router = express.Router();
const ShopController = require("../controllers/shop.controller");
const UploadController = require("../controllers/upload.controller");

router.get("/", ShopController.getList);
router.get("/:id", ShopController.findById);
router.post("/", ShopController.create); 
router.post("/:id/uploadImage", UploadController.uploadImage, ShopController.uploadImage);
router.post("/:id/deleteImage", ShopController.deleteImage, UploadController.deleteImage);
router.put("/:id", ShopController.updateById);
router.delete("/:id", ShopController.deleteById);

module.exports = router;
