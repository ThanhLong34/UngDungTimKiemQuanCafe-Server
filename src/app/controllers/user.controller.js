const UserSchema = require("../models/user.model");
const { UserValidator } = require("../validators");
const ShopService = require("../services/shop.service");
const { generatePassword } = require("../../utils/bcrypt");

class UserController {
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

			const { error } = UserValidator.register(payload);
			if (error) {
				res.json({
					code: 2,
					message: error.message,
				});
				return;
			}

			const itemExisted = await UserSchema.findOne({
				$or: [
					{ email: payload.email },
					{ phoneNumber: payload.phoneNumber },
				],
			});
			if (itemExisted) {
				res.json({
					code: 3,
					message: "Email hoặc Số điện thoại đã tồn tại",
				});
				return;
			}

			// create method in Schema not allowed handle prev middleware in mongoose
			const newDocument = new UserSchema(payload);
			newDocument.password = generatePassword(newDocument.password);
			const saveUserResult = await newDocument.save();

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

			const { error } = UserValidator.login(payload);
			if (error) {
				res.json({
					code: 2,
					message: error.message,
				});
				return;
			}

			const accountExisted = await UserSchema.findOne({
				$or: [
					{ email: payload.email },
					{ phoneNumber: payload.phoneNumber },
				],
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

	// [POST] /users/:id/addFavouriteById
	async addFavouriteById(req, res, next) {
		try {
			const { id } = req.params;
			const { shopId } = req.body;

			const { error } = UserValidator.addOrRemoveFavourite(shopId);
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

			if (itemFound.favourites.find((i) => i === shopId)) {
				res.json({
					code: 3,
					message: "shopId đã có sẵn trong favourites",
				});
				return;
			}

			// Cập nhật favouriteQuantity của shop
			const err = await ShopService.increaseFavouriteQuantity(shopId, 1);
			if (err) throw err;

			itemFound.favourites.push(shopId);
			const saveResult = await itemFound.save();

			res.json({
				code: 1,
				message: "Thêm vào favourites thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [POST] /users/:id/removeFavouriteById
	async removeFavouriteById(req, res, next) {
		try {
			const { id } = req.params;
			const { shopId } = req.body;

			const { error } = UserValidator.addOrRemoveFavourite(shopId);
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

			if (!(itemFound.favourites.find((i) => i === shopId))) {
				res.json({
					code: 3,
					message: "shopId không có trong favourites",
				});
				return;
			}

			// Cập nhật favouriteQuantity của shop
			const err = await ShopService.decreaseFavouriteQuantity(shopId, 1);
			if (err) throw err;

			itemFound.favourites = itemFound.favourites.filter(i => i !== shopId);
			const saveResult = await itemFound.save();

			res.json({
				code: 1,
				message: "Xóa khỏi favourites thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [PUT] /users/:id/updatePasswordById
	async updatePasswordById(req, res, next) {
		try {
			const { id } = req.params;
			const { newPassword } = req.body;

			const { error } = UserValidator.updatePassword(newPassword);
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

			itemFound.password = generatePassword(newPassword);
			const saveResult = await itemFound.save();

			res.json({
				code: 1,
				message: "Cập nhật mật khẩu tài khoản thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [PUT] /users/:id/updateFavouritesById
	async updateFavouritesById(req, res, next) {
		try {
			const { id } = req.params;
			const { favourites } = req.body;

			const { error } = UserValidator.updateFavourites(favourites);
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

			itemFound.favourites = favourites;
			const saveResult = await itemFound.save();

			res.json({
				code: 1,
				message: "Cập nhật favourites tài khoản thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [PUT] /users/:id/upgrade
	async upgradeById(req, res, next) {
		try {
			const { id } = req.params;
			const { priceId } = req.body;

			const { error } = UserValidator.upgrade(priceId);
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

			itemFound.isOwnerShop = true;
			itemFound.priceId = priceId;
			const saveResult = await itemFound.save();

			res.json({
				code: 1,
				message: "Nâng cấp tài khoản thành công",
			});
		} catch (error) {
			next(error);
		}
	}

	// [DELETE] /users/:id
	async deleteById(req, res, next) {
		try {
			const id = req.params.id;

			const deleteResult = await UserSchema.delete({
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

module.exports = new UserController();
