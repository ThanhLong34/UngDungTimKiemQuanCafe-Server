const userRouter = require("./user.router");
const priceRouter = require("./price.router");
const shopRouter = require("./shop.router");
const feedbackRouter = require("./feedback.router");

function configRouter(app) {
	if (!app) return;

	app.use("/users", userRouter);
	app.use("/prices", priceRouter);
	app.use("/shops", shopRouter);
	app.use("/feedbacks", feedbackRouter);
}

module.exports = configRouter;
