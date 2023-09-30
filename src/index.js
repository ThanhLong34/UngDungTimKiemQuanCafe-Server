require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const configRouter = require("./app/routers");
const mongoDBConnect = require("./config/mongoDB");
const {
	sortMiddleware,
	searchMiddleware,
	limitMiddleware,
} = require("./app/middlewares");

//? Chạy server
(async function startServer() {
	//? Kết nối MongoDB
	const connectResult = await mongoDBConnect.connect();
	if (!connectResult) return;

	//? Khởi tạo App
	const app = express();
	const PORT = process.env.PORT || 5000;
	const fileUploader = multer({
		storage: multer.diskStorage({
			destination: (req, file, cb) => {
				cb(null, "public/upload");
			},
			filename: function (req, file, cb) {
				cb(
					null,
					file.fieldname +
						"-" +
						Date.now() +
						path.extname(file.originalname)
				);
			},
		}),
	});

	//? Middlewares
	app.use(morgan("dev"));
	app.use(
		cors({
			origin: "*",
			methods: ["GET", "POST", "PUT", "DELETE"],
		})
	);
	app.use(express.urlencoded({ extended: true })); // Middleware FormData HTML from request
	app.use(express.json()); // Middleware JSON from request
	app.use(sortMiddleware); // Sort middleware
	app.use(searchMiddleware); // Search middleware
	app.use(limitMiddleware); // Limit & Offset middleware

	//? Static folder
	// localhost/upload/...
	app.use("/", express.static(path.join(__dirname, "../public")));

	//? Cấu hình routes
	configRouter(app);

	//? Bắt lỗi không đúng URL
	app.use((req, res, next) => {
		res.json({
			code: 999,
			message: "URL không tồn tại",
		});
	});
	app.use((err, req, res, next) => {
		console.error(err);
		res.json({
			code: err.status,
			message: err.message,
		});
	});

	//? Khởi chạy máy chủ
	app.listen(PORT, () => {
		console.log(`🚀 Máy chủ đang chạy trên: http://localhost:${PORT}`);
	});
})();
