const Joi = require("joi");

module.exports = {
	createOrUpdate(data) {
		const schema = Joi.object({
			title: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.max(255)
				.messages({
					"string.trim":
						"title không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có title",
					"string.empty": "title không được để trống",
					"string.max": "title không được quá 255 ký tự",
				}),
			description: Joi.string().strict().max(1000).messages({
				"string.max": "description không được quá 1000 ký tự",
			}),
			features: Joi.array().items(
				Joi.string().strict().max(255).messages({
					"string.max": "features item không được quá 255 ký tự",
				})
			),
			costPerMonth: Joi.number().strict().required().messages({
				"any.required": "Bắt buộc phải có costPerMonth",
			})
		});

		return schema.validate(data);
	},
};
