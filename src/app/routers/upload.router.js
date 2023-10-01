const express = require("express");
const router = express.Router();
const UploadController = require("../controllers/upload.controller");

router.post("/getImages", UploadController.getImages);
router.post("/", UploadController.uploadImage);
router.delete("/:id", UploadController.deleteImage);

module.exports = router;
