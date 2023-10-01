const Joi = require("joi");

module.exports = {
	getImages(ids) {
		const schema = Joi.array().items(
			Joi.string().trim().empty().strict().messages({
				"string.trim": "ids item không được chứa khoảng trắng đầu và cuối",
				"any.required": "Bắt buộc phải có ids item",
				"string.empty": "ids item không được để trống",
			})
		);

		return schema.validate(ids);
	},
};
