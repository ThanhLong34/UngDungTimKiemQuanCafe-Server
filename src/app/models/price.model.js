const mongoose = require("mongoose");
const {
	sortable,
	searchable,
	limitable,
} = require("../../utils/customQueries");

const Schema = mongoose.Schema;

const PriceSchema = new Schema({
	title: { type: String, maxLength: 255, required: true },
	description: { type: String, maxLength: 1000, default: "" },
	features: {
		type: [
			{
				type: String,
				maxlength: 255,
				default: ''
			},
		],
		default: [],
	},
	costPerMonth: { type: Number, required: true },
});

// Custom queries
PriceSchema.query.sortable = sortable;
PriceSchema.query.searchable = searchable;
PriceSchema.query.limitable = limitable;

module.exports = mongoose.model("prices", PriceSchema);
