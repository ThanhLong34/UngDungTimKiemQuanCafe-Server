const userRouter = require("./user.router");

function configRouter(app) {
	if (!app) return;

	app.use("/users", userRouter);
}

module.exports = configRouter;
