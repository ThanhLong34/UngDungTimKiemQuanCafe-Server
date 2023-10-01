const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const {
	sortable,
	searchable,
	limitable,
} = require("../../utils/customQueries");

const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
	star: { type: Number, required: true },
	comment: { type: String, maxLength: 1000, required: true },
	postDate: { type: Date, default: Date.now },
	userId: { type: String, required: true },
	shopId: { type: String, required: true },
}, { timestamps: true });

// Custom queries
FeedbackSchema.query.sortable = sortable;
FeedbackSchema.query.searchable = searchable;
FeedbackSchema.query.limitable = limitable;

// Add plugin
FeedbackSchema.plugin(mongooseDelete, {
	overrideMethods: "all",
	deletedAt: true,
});

module.exports = mongoose.model("feedbacks", FeedbackSchema);
