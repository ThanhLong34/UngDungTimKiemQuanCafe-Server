const UserAccountSchema = require("../models/userAccount.model");
const { userAccountValidator } = require("../validators");

class userAccountController {
	// [GET] /userAccounts
	async getList(req, res, next) {
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

	// [GET] /userAccounts/:id
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

	// [POST] /userAccounts/register
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
				$or: [{ email: payload.email }, { phone: payload.phone }],
			});
			if (itemExisted) {
				res.json({
					code: 3,
					message: "Email hoặc Số điện thoại đã tồn tại",
				});
				return;
			}

			// create method in Schema not allowed handle prev middleware in mongoose
			const newUser = new UserAccountSchema(payload);
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

	// [POST] /userAccounts/login
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

			const accountExisted = await UserAccountSchema.findOne({
				$or: [{ email: payload.email }, { phone: payload.phone }],
			});
			if (!accountExisted) {
				res.json({
					code: 3,
					message: "Không tìm thấy tài khoản",
				});
				return;
			}

			const isMatchPassword = await accountExisted.isMatchPassword(
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
				data: { ...accountExisted._doc, password: null },
				message: "Đăng nhập thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [PUT] /userAccounts/:id/updatePasswordById
	async updatePasswordById(req, res, next) {
		try {
			const id = req.params.id;
			const newPassword = req.body.newPassword;

			const { error } = userAccountValidator.updatePassword(newPassword);
			if (error) {
				res.json({
					code: 4,
					message: error.message,
				});
				return;
			}

			const itemFound = await UserAccountSchema.findOne({
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

	// [DELETE] /userAccounts/:id
	async deleteById(req, res, next) {
		try {
			const id = req.params.id;

			const deleteResult = await UserAccountSchema.deleteOne({
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

module.exports = new userAccountController();
