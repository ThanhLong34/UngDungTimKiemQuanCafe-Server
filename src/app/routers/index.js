const userAccountRouter = require("./userAccount.router");

function configRouter(app) {
	if (!app) return;

	app.use("/userAccounts", userAccountRouter);
}

module.exports = configRouter;
