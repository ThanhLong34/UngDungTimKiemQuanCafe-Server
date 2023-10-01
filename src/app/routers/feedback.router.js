const express = require("express");
const router = express.Router();
const FeedbackController = require("../controllers/feedback.controller");

router.get("/", FeedbackController.getList);
router.get("/:id", FeedbackController.findById);
router.post("/", FeedbackController.create);
router.put("/:id", FeedbackController.updateById);
router.delete("/:id", FeedbackController.deleteById);

module.exports = router;
