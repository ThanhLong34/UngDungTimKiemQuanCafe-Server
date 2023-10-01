const mongoose = require("mongoose");
const {
	sortable,
	searchable,
	limitable,
} = require("../../utils/customQueries");

const Schema = mongoose.Schema;

const ShopSchema = new Schema({
	name: { type: String, maxLength: 255, required: true },
	description: { type: String, maxLength: 1000, default: "" },
	provinceCode: { type: String, maxLength: 10, required: true },
	districtCode: { type: String, maxLength: 10, required: true },
	stressAddress: { type: String, maxLength: 255, required: true },
	workTime: {
		type: [
			{
				hours: {
					type: Number,
					default: 0,
				},
				minutes: {
					type: Number,
					default: 0,
				},
			},
		],
		required: true,
	},
	phoneNumber: { type: String, maxLength: 255, default: "" },
	websiteURL: { type: String, maxLength: 1000, default: "" },
	shopeeFoodURL: { type: String, maxLength: 1000, default: "" },
	geolocation: {
		type: [
			{
				type: String,
				maxlength: 255,
				default: "",
			},
		],
		default: [],
	},
	imageIds: {
		type: [String],
		default: [],
	},
	menu: {
		type: [
			{
				name: {
					type: String,
					maxlength: 255,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		default: [],
	},
	favouriteQuantity: { type: Number, default: 0 },
	userId: { type: String, default: "" },
});

// Custom queries
ShopSchema.query.sortable = sortable;
ShopSchema.query.searchable = searchable;
ShopSchema.query.limitable = limitable;

module.exports = mongoose.model("shops", ShopSchema);
