const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const bcrypt = require("bcrypt");
const {
	sortable,
	searchable,
	limitable,
} = require("../../utils/customQueries");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		fullName: { type: String, maxLength: 255, required: true },
		phoneNumber: { type: String, maxLength: 255, required: true },
		email: { type: String, maxLength: 255, required: true },
		password: { type: String, maxLength: 255, required: true },
		favourites: {
			type: [String],
			default: [],
		},
		isOwnerShop: { type: Boolean, default: false },
		priceId: { type: String, default: null },
	},
	{ timestamps: true }
);

// Hash password pre save or create user
// Dont use arrow function because it does not have context
// UserSchema.pre("save", async function (next) {
// 	try {
// 		const salt = await bcrypt.genSalt(10);
// 		const hashPassword = await bcrypt.hash(this.password, salt);
// 		this.password = hashPassword;
// 		next();
// 	} catch (error) {
// 		next(error);
// 	}
// });

// Custom queries
UserSchema.query.sortable = sortable;
UserSchema.query.searchable = searchable;
UserSchema.query.limitable = limitable;

// Custom methods
UserSchema.methods.hashPassword = async function () {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashPass = await bcrypt.hash(this.password, salt);
		this.password = hashPass;
	} catch (error) {}
};
UserSchema.methods.checkMatchPassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (error) {}
};

// Add plugin
UserSchema.plugin(mongooseDelete, {
	overrideMethods: "all",
	deletedAt: true,
});

module.exports = mongoose.model("users", UserSchema);
