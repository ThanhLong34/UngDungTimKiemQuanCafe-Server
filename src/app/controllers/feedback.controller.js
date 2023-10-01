const FeedbackSchema = require("../models/feedback.model");
const { FeedbackValidator } = require("../validators");

class FeedbackController {
	// [GET] /feedbacks
	async getList(req, res, next) {
		try {
			const listResultFound = await FeedbackSchema.find({})
				.sortable(req)
				.searchable(req)
				.limitable(req);

			const allDocuments = await FeedbackSchema.find({}).searchable(req);

			if (listResultFound) {
				res.json({
					code: 1,
					data: listResultFound,
					totalLength: allDocuments.length,
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

	// [GET] /feedbacks/:id
	async findById(req, res, next) {
		try {
			const id = req.params.id;
			const itemFound = await FeedbackSchema.findOne({
				_id: id,
			});

			if (itemFound) {
				res.json({
					code: 1,
					data: { ...itemFound._doc },
					message: "Đã tìm thấy",
				});
			} else {
				res.json({
					code: 2,
					message: "Không tìm thấy",
				});
			}
		} catch (error) {
			next(error);
		}
	}

	// [POST] /feedbacks
	async create(req, res, next) {
		try {
			const payload = { ...req.body };

			const { error } = FeedbackValidator.createOrUpdate(payload);
			if (error) {
				res.json({
					code: 2,
					message: error.message,
				});
				return;
			}

			// create method in Schema not allowed handle prev middleware in mongoose
			const newDocument = new FeedbackSchema(payload);
			const createResult = await newDocument.save();

			res.json({
				code: 1,
				data: { ...createResult._doc },
				message: "Tạo thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [PUT] /feedbacks/:id
	async updateById(req, res, next) {
		try {
			const id = req.params.id;
			const payload = { ...req.body };

			const { error } = FeedbackValidator.createOrUpdate(payload);
			if (error) {
				res.json({
					code: 4,
					message: error.message,
				});
				return;
			}

			const updateResult = await FeedbackSchema.updateOne(
				{
					_id: id,
				},
				payload
			);

			if (updateResult.modifiedCount > 0) {
				res.json({
					code: 1,
					message: "Cập nhật thành công",
				});
			} else {
				res.json({
					code: 2,
					message: "Không tìm thấy document cần cập nhật",
				});
			}
		} catch (error) {
			next(error);
		}
	}

	// [DELETE] /feedbacks/:id
	async deleteById(req, res, next) {
		try {
			const id = req.params.id;

			const deleteResult = await FeedbackSchema.delete({
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

module.exports = new FeedbackController();
