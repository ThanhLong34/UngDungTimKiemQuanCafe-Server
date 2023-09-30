const mongoose = require("mongoose");

async function connect() {
	try {
		await mongoose.connect(process.env.MONGODB_CONNECT_STRING + process.env.MONGODB_DATABASE_NAME, {});
		console.log("🟢 Kết nối MongoDB thành công");
		return true
	} catch (error) {
		console.error('❌ Kết nối MongoDB thất bại: ', error);
		return false
	}
}

module.exports = { connect };
