const UserSchema = require("../models/user.model");
const { userValidator } = require("../validators");

class userController {
	// [GET] /users
	async getList(req, res, next) {
		try {
			const listResultFound = await UserSchema.find({})
				.sortable(req)
				.searchable(req)
				.limitable(req);

			const allDocuments = await UserSchema.find({}).searchable(req);

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

	// [GET] /users/:id
	async findById(req, res, next) {
		try {
			const id = req.params.id;
			const itemFound = await UserSchema.findOne({
				_id: id,
			});

			if (itemFound) {
				res.json({
					code: 1,
					data: { ...itemFound._doc, password: null },
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

	// [POST] /users/register
	async register(req, res, next) {
		try {
			const payload = { ...req.body };

			const { error } = userValidator.register(payload);
			if (error) {
				res.json({
					code: 2,
					message: error.message,
				});
				return;
			}

			const itemExisted = await UserSchema.findOne({
				$or: [{ email: payload.email }, { phoneNumber: payload.phoneNumber }],
			});
			if (itemExisted) {
				res.json({
					code: 3,
					message: "Email hoặc Số điện thoại đã tồn tại",
				});
				return;
			}

			// create method in Schema not allowed handle prev middleware in mongoose
			const newUser = new UserSchema(payload);
			const saveUserResult = await newUser.save();

			res.json({
				code: 1,
				data: { ...saveUserResult._doc, password: null },
				message: "Tạo tài khoản thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [POST] /users/login
	async login(req, res, next) {
		try {
			const payload = { ...req.body };

			const { error } = userValidator.login(payload);
			if (error) {
				res.json({
					code: 2,
					message: error.message,
				});
				return;
			}

			const accountExisted = await UserSchema.findOne({
				$or: [{ email: payload.email }, { phoneNumber: payload.phoneNumber }],
			});
			if (!accountExisted) {
				res.json({
					code: 3,
					message: "Không tìm thấy tài khoản",
				});
				return;
			}

			const checkMatchPassword = await accountExisted.checkMatchPassword(
				payload.password
			);
			if (!checkMatchPassword) {
				res.json({
					code: 4,
					message: `Sai mật khẩu`,
				});
				return;
			}

			res.json({
				code: 1,
				data: { ...accountExisted._doc, password: null },
				message: "Đăng nhập thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [PUT] /users/:id/updatePasswordById
	async updatePasswordById(req, res, next) {
		try {
			const id = req.params.id;
			const newPassword = req.body.newPassword;

			const { error } = userValidator.updatePassword(newPassword);
			if (error) {
				res.json({
					code: 4,
					message: error.message,
				});
				return;
			}

			const itemFound = await UserSchema.findOne({
				_id: id,
			});
			if (!itemFound) {
				res.json({
					code: 5,
					message: "Không tìm thấy tài khoản",
				});
				return;
			}

			itemFound.password = newPassword;
			const saveResult = await itemFound.save();

			res.json({
				code: 1,
				message: "Cập nhật mật khẩu tài khoản thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [DELETE] /users/:id
	async deleteById(req, res, next) {
		try {
			const id = req.params.id;

			const deleteResult = await UserSchema.deleteOne({
				_id: id,
			});
			if (deleteResult.deletedCount > 0) {
				res.json({
					code: 1,
					message: "Xóa thành công",
				});
			} else {
				res.json({
					code: 2,
					message: "Không tìm thấy document cần xóa",
				});
			}
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new userController();
