const UserRouter = require("./user.router");
const PriceRouter = require("./price.router");
const ShopRouter = require("./shop.router");
const FeedbackRouter = require("./feedback.router");
const UploadRouter = require("./upload.router");

function configRouter(app) {
	if (!app) return;

	app.use("/users", UserRouter);
	app.use("/prices", PriceRouter);
	app.use("/shops", ShopRouter);
	app.use("/feedbacks", FeedbackRouter);
	app.use("/uploads", UploadRouter);
}

module.exports = configRouter;
