const mongoose = require("mongoose");
const ImageSchema = require("../models/image.model");
const { UploadValidator } = require("../validators");
const multer = require("multer");
const path = require("path");
const { unlink } = require("fs");

const MIME_TYPE_MAP = {
	"image/png": "png",
	"image/jpeg": "jpeg",
	"image/jpg": "jpg",
};

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "public/uploads");
		},
		filename: function (req, file, cb) {
			cb(
				null,
				file.fieldname + "-" + Date.now() + path.extname(file.originalname)
			);
		},
	}),
	fileFilter: (req, file, cb) => {
		const isValid = !!MIME_TYPE_MAP[file.mimetype];
		let error = isValid ? null : new Error("Định dạng file không hợp lệ!");
		cb(error, isValid);
	},
}).single("image");

class UploadController {
	async getImages(req, res, next) {
		try {
			const { ids } = req.body;

			const { error } = UploadValidator.getImages(ids);
			if (error) {
				res.json({
					code: 2,
					message: error.message,
				});
				return;
			}

			const mongooseIds = ids.map((i) => new mongoose.Types.ObjectId(i));

			const listResultFound = await ImageSchema.find({
				_id: {
					$in: mongooseIds,
				},
			});
			if (listResultFound) {
				res.json({
					code: 1,
					data: listResultFound,
					message: "Lấy danh sách thành công",
				});
			} else {
				res.json({
					code: 2,
					message: "Lấy danh sách thất bại",
				});
			}
		} catch (error) {
			next(error);
		}
	}

	// [POST] /uploads
	async uploadImage(req, res, next) {
		upload(req, res, async function (err) {
			if (err) {
				res.json({
					code: 3,
					message: err.toString(),
				});
				return;
			}

			try {
				const payload = req.file;

				// create method in Schema not allowed handle prev middleware in mongoose
				const newDocument = new ImageSchema(payload);
				const createResult = await newDocument.save();

				// res.json({
				// 	code: 1,
				// 	data: { ...createResult._doc },
				// 	message: "Tạo thành công",
				// });

				res.locals.imageObject = { ...createResult._doc };
				next();
			} catch (error) {
				console.error(error);
				return error;
			}
		});
	}

	// [DELETE] /uploads/:id
	async deleteImage(req, res, next) {
		try {
			const id = req.params.id || res.locals.id;

			const itemExisted = await ImageSchema.findOne({
				_id: id,
			});
			if (!itemExisted) {
				res.json({
					code: 3,
					message: "Hình ảnh không tồn tại",
				});
				return;
			}

			const imageFilePath = path.join(
				__dirname,
				`../../../${itemExisted.destination}/${itemExisted.filename}`
			);
			await unlink(imageFilePath);

			const deleteResult = await ImageSchema.deleteOne({
				_id: id,
			});

			res.json({
				code: 1,
				data: deleteResult,
				message: "Xóa thành công",
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UploadController();
