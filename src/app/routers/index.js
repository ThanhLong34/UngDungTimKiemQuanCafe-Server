const userRouter = require("./user.router");
const priceRouter = require("./price.router");

function configRouter(app) {
	if (!app) return;

	app.use("/users", userRouter);
	app.use("/prices", priceRouter);
}

module.exports = configRouter;
