const Joi = require("joi");

module.exports = {
	register(data) {
		const schema = Joi.object({
			fullName: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.max(255)
				.messages({
					"string.trim":
						"fullName không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có fullName",
					"string.empty": "fullName không được để trống",
					"string.max": "fullName không được quá 255 ký tự",
				}),
			phoneNumber: Joi.string()
				.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
				.trim()
				.required()
				.empty()
				.strict()
				.max(255)
				.messages({
					"string.trim":
						"phoneNumber không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có phoneNumber",
					"string.empty": "phoneNumber không được để trống",
					"string.pattern.base": "phoneNumber không hợp lệ",
					"string.max": "phoneNumber không được quá 255 ký tự",
				}),
			email: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.email()
				.max(255)
				.messages({
					"string.trim": "email không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có email",
					"string.empty": "email không được để trống",
					"string.email": "email không hợp lệ",
					"string.max": "email không được quá 255 ký tự",
				}),
			password: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.min(5)
				.max(255)
				.messages({
					"string.trim":
						"password không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có password",
					"string.empty": "password không được để trống",
					"string.min": "password phải chứa ít nhất 5 ký tự",
					"string.max": "password không được quá 255 ký tự",
				}),
			isOwnerShop: Joi.boolean().strict(),
			priceId: Joi.string().trim().empty().strict().messages({
				"string.trim":
					"priceId không được chứa khoảng trắng đầu và cuối",
				"string.empty": "priceId không được để trống",
			}),
		});

		return schema.validate(data);
	},

	login(data) {
		const schema = Joi.object({
			phoneNumber: Joi.string()
				.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
				.trim()
				.empty()
				.strict()
				.max(255)
				.messages({
					"string.trim":
						"phoneNumber không được chứa khoảng trắng đầu và cuối",
					"string.empty": "phoneNumber không được để trống",
					"string.pattern.base": "phoneNumber không hợp lệ",
					"string.max": "phoneNumber không được quá 255 ký tự",
				}),
			email: Joi.string().trim().empty().strict().email().max(255).messages({
				"string.trim": "email không được chứa khoảng trắng đầu và cuối",
				"string.empty": "email không được để trống",
				"string.email": "email không hợp lệ",
				"string.max": "email không được quá 255 ký tự",
			}),
			password: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.min(5)
				.max(255)
				.messages({
					"string.trim":
						"password không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có password",
					"string.empty": "password không được để trống",
					"string.min": "password phải chứa ít nhất 5 ký tự",
					"string.max": "password không được quá 255 ký tự",
				}),
		});

		return schema.validate(data);
	},

	updatePassword(newPassword) {
		const schema = Joi.string()
			.trim()
			.required()
			.empty()
			.strict()
			.min(5)
			.max(255)
			.messages({
				"string.trim": "newPassword không được chứa khoảng trắng đầu và cuối",
				"any.required": "Bắt buộc phải có newPassword",
				"string.empty": "newPassword không được để trống",
				"string.min": "newPassword phải chứa ít nhất 5 ký tự",
				"string.max": "newPassword không được quá 255 ký tự",
			});

		return schema.validate(newPassword);
	},

	upgrade(priceId) {
		const schema = Joi.string().trim().required().empty().strict().messages({
			"string.trim": "priceId không được chứa khoảng trắng đầu và cuối",
			"any.required": "Bắt buộc phải có priceId",
			"string.empty": "priceId không được để trống",
		});

		return schema.validate(priceId);
	},

	updateFavorites(favorites) {
		const schema = Joi.array().items(
			Joi.string().trim().empty().strict().messages({
				"string.trim": "favorites item không được chứa khoảng trắng đầu và cuối",
				"string.empty": "favorites item không được để trống",
			})
		);

		return schema.validate(favorites);
	},
};
