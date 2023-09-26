const UserAccountSchema = require("../models/userAccount.model");
const { userAccountValidator } = require("../validators");

class userAccountController {
	// [GET] /users
	async getAll(req, res, next) {
		try {
			const listResultFound = await UserAccountSchema.find({})
				.sortable(req)
				.searchable(req)
				.limitable(req);

			const allDocuments = await UserAccountSchema.find({}).searchable(req);

			if (listResultFound) {
				res.json({
					code: 1,
					data: listResultFound,
					totalLength: allDocuments.length,
					message: "Lấy danh sách người dùng thành công",
				});
			} else {
				res.json({
					code: 2,
					message: "Lấy danh sách người dùng thất bại",
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
			const itemFound = await UserAccountSchema.findOne({
				_id: id,
			});

			if (itemFound) {
				res.json({
					code: 1,
					data: { ...itemFound._doc, password: null },
					message: "Đã tìm thấy tài khoản người dùng",
				});
			} else {
				res.json({
					code: 2,
					message: "Không tìm thấy tài khoản người dùng",
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

			const { error } = userAccountValidator.register(payload);
			if (error) {
				res.json({
					code: 2,
					message: error.message,
				});
				return;
			}

			const itemExisted = await UserAccountSchema.findOne({
				email: payload.email,
			});
			if (itemExisted) {
				res.json({
					code: 3,
					message: "Email đã tồn tại",
				});
				return;
			}

			// create method in Schema not allowed handle prev middleware in mongoose
			const newUser = new UserAccountSchema(payload);
			const saveUserResult = await newUser.save();

			res.json({
				code: 1,
				data: { ...saveUserResult._doc, password: null },
				message: "Tạo tài khoản người dùng thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [POST] /users/login
	async login(req, res, next) {
		try {
			const payload = { ...req.body };

			const { error } = userAccountValidator.login(payload);
			if (error) {
				res.json({
					code: 2,
					message: error.message,
				});
				return;
			}

			const userExist = await UserAccountSchema.findOne({
				email: payload.email,
			});
			if (!userExist) {
				res.json({
					code: 3,
					message: `Không tìm thấy tài khoản có email: ${payload.email}`,
				});
				return;
			}

			const isMatchPassword = await userExist.isMatchPassword(
				payload.password
			);
			if (!isMatchPassword) {
				res.json({
					code: 4,
					message: `Sai mật khẩu`,
				});
				return;
			}

			res.json({
				code: 1,
				data: { ...userExist._doc, password: null },
				message: "Đăng nhập thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [PUT] /users/:id/updatePasswordById
	async updatePasswordById(req, res, next) {
		try {
			// Lấy id từ params
			const userId = req.params.id;
			// Lấy password mới từ body của request
			const newPassword = req.body.password;

			// Xác thực password mới
			const { error } = userAccountValidator.updatePassword(newPassword);
			if (error) {
				res.json({
					code: 4,
					message: error.message,
				});
				return;
			}

			// Tìm tài khoản người dùng để cập nhật mật khẩu mới (newPassword)
			const userFound = await UserAccountSchema.findOne({
				_id: userId,
			});
			if (!userFound) {
				res.json({
					code: 5,
					message: "Không tìm thấy tài khoản người dùng",
				});
				return;
			}

			// Cập nhật mật khẩu mới (newPassword)
			userFound.password = newPassword;
			const saveUserResult = await userFound.save();

			res.json({
				code: 1,
				message: "Cập nhật mật khẩu tài khoản người dùng thành công",
			});
		} catch (error) {
			// Bắt lỗi
			next(error);
		}
	}

	// [DELETE] /users/:id
	async deleteById(req, res, next) {
		try {
			const id = req.params.id;

			const deleteResult = await UserAccountSchema.deleteOne({
				_id: id,
			});
			if (deleteResult.deletedCount > 0) {
				res.json({
					code: 1,
					message: "Xóa người dùng thành công",
				});
			} else {
				res.json({
					code: 2,
					message: "Không tìm thấy người dùng cần xóa",
				});
			}
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new userAccountController();
