const Joi = require("joi");

module.exports = {
	register(data) {
		const schema = Joi.object({
			email: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.email()
				.messages({
					"string.trim": "Email không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có Email",
					"string.empty": "Email không được để trống",
					"string.email": "Email không hợp lệ",
				}),
			phone: Joi.string()
				.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
				.trim()
				.required()
				.empty()
				.strict()
				.messages({
					"string.trim":
						"Số điện thoại không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có Số điện thoại",
					"string.empty": "Số điện thoại không được để trống",
					"string.pattern.base": "Số điện thoại không hợp lệ",
				}),
			password: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.min(5)
				.messages({
					"string.trim":
						"Mật khẩu không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có Mật khẩu",
					"string.empty": "Mật khẩu không được để trống",
					"string.min": "Mật khẩu phải chứa ít nhất 5 ký tự",
				}),
		});

		return schema.validate(data);
	},

	login(data) {
		const schema = Joi.object({
			email: Joi.string()
				.trim()
				.empty()
				.strict()
				.email()
				.messages({
					"string.trim": "Email không được chứa khoảng trắng đầu và cuối",
					"string.empty": "Email không được để trống",
					"string.email": "Email không hợp lệ",
				}),
			phone: Joi.string()
				.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
				.trim()
				.empty()
				.strict()
				.messages({
					"string.trim":
						"Số điện thoại không được chứa khoảng trắng đầu và cuối",
					"string.empty": "Số điện thoại không được để trống",
					"string.pattern.base": "Số điện thoại không hợp lệ",
				}),
			password: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.min(5)
				.messages({
					"string.trim":
						"Mật khẩu không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có Mật khẩu",
					"string.empty": "Mật khẩu không được để trống",
					"string.min": "Mật khẩu phải chứa ít nhất 5 ký tự",
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
			.messages({
				"string.trim": "Mật khẩu không được chứa khoảng trắng đầu và cuối",
				"any.required": "Bắt buộc phải có Mật khẩu",
				"string.empty": "Mật khẩu không được để trống",
				"string.min": "Mật khẩu phải chứa ít nhất 5 ký tự",
			});

		return schema.validate(newPassword);
	},
};
