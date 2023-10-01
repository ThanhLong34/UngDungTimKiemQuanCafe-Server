const mongoose = require("mongoose");
const {
	sortable,
	searchable,
	limitable,
} = require("../../utils/customQueries");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	filename: { type: String, required: true },
	destination: { type: String, required: true },
	mimetype: { type: String, required: true },
	size: { type: Number, required: true },
}, { timestamps: true });

// Custom queries
ImageSchema.query.sortable = sortable;
ImageSchema.query.searchable = searchable;
ImageSchema.query.limitable = limitable;

module.exports = mongoose.model("images", ImageSchema);
