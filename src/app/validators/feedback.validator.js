const Joi = require("joi");

module.exports = {
	createOrUpdate(data) {
		const schema = Joi.object({
			star: Joi.number().strict().required().messages({
				"any.required": "Bắt buộc phải có star",
			}),
			comment: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.max(1000)
				.messages({
					"string.trim":
						"comment không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có comment",
					"string.empty": "comment không được để trống",
					"string.max": "comment không được quá 1000 ký tự",
				}),
			userId: Joi.string().trim().required().empty().strict().messages({
				"string.trim": "userId không được chứa khoảng trắng đầu và cuối",
				"any.required": "Bắt buộc phải có userId",
				"string.empty": "userId không được để trống",
			}),
			shopId: Joi.string().trim().required().empty().strict().messages({
				"string.trim": "shopId không được chứa khoảng trắng đầu và cuối",
				"any.required": "Bắt buộc phải có shopId",
				"string.empty": "shopId không được để trống",
			}),
		});

		return schema.validate(data);
	},
};
