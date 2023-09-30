const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
	sortable,
	searchable,
	limitable,
} = require("../../utils/customQueries");
const { checkMatchPassword } = require("../../utils/customMethods");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	fullName: { type: String, maxLength: 255, required: true },
	phoneNumber: { type: String, maxLength: 255, required: true, unique: true },
	email: { type: String, maxLength: 255, required: true, unique: true },
	password: { type: String, maxLength: 255, required: true },
	favourites: { type: [String], default: [] },
	isOwnerShop: { type: Boolean, default: false },
	priceId: { type: String, default: null },
});

// Hash password pre save or create user
// Dont use arrow function because it does not have context
UserSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(this.password, salt);
		this.password = hashPassword;
		next();
	} catch (error) {
		next(error);
	}
});

// Custom queries
UserSchema.query.sortable = sortable;
UserSchema.query.searchable = searchable;
UserSchema.query.limitable = limitable;

// Custom methods
UserSchema.methods.checkMatchPassword = checkMatchPassword;

module.exports = mongoose.model("users", UserSchema);
