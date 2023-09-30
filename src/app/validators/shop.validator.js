const Joi = require("joi");

module.exports = {
	createOrUpdate(data) {
		const schema = Joi.object({
			name: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.max(255)
				.messages({
					"string.trim": "name không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có name",
					"string.empty": "name không được để trống",
					"string.max": "name không được quá 255 ký tự",
				}),
			description: Joi.string().strict().max(1000).messages({
				"string.max": "description không được quá 1000 ký tự",
			}),
			provinceCode: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.max(10)
				.messages({
					"string.trim":
						"provinceCode không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có provinceCode",
					"string.empty": "provinceCode không được để trống",
					"string.max": "provinceCode không được quá 10 ký tự",
				}),
			districtCode: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.max(10)
				.messages({
					"string.trim":
						"districtCode không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có districtCode",
					"string.empty": "districtCode không được để trống",
					"string.max": "districtCode không được quá 10 ký tự",
				}),
			stressAddress: Joi.string()
				.trim()
				.required()
				.empty()
				.strict()
				.max(255)
				.messages({
					"string.trim":
						"stressAddress không được chứa khoảng trắng đầu và cuối",
					"any.required": "Bắt buộc phải có stressAddress",
					"string.empty": "stressAddress không được để trống",
					"string.max": "stressAddress không được quá 255 ký tự",
				}),
			workTime: Joi.array()
				.items({
					hours: Joi.number().strict(),
					minutes: Joi.number().strict(),
				})
				.strict()
				.required()
				.messages({
					"any.required": "Bắt buộc phải có workTime",
				}),
			phoneNumber: Joi.string().strict().max(255).messages({
				"string.max": "phoneNumber không được quá 255 ký tự",
			}),
			websiteURL: Joi.string().strict().max(1000).messages({
				"string.max": "websiteURL không được quá 1000 ký tự",
			}),
			shopeeFoodURL: Joi.string().strict().max(1000).messages({
				"string.max": "shopeeFoodURL không được quá 1000 ký tự",
			}),
			geolocation: Joi.array().items(
				Joi.string().strict().max(255).messages({
					"string.max": "geolocation item không được quá 255 ký tự",
				})
			),
			imageIds: Joi.array().items(Joi.string().strict()),
			menu: Joi.array().items({
				name: Joi.string()
					.trim()
					.required()
					.empty()
					.strict()
					.max(255)
					.messages({
						"string.trim":
							"menu item.name không được chứa khoảng trắng đầu và cuối",
						"any.required": "Bắt buộc phải có menu item.name",
						"string.empty": "menu item.name không được để trống",
						"string.max": "menu item.name không được quá 255 ký tự",
					}),
				price: Joi.number().strict(),
			}),
			favouriteQuantity: Joi.number().strict(),
			userId: Joi.string().strict(),
		});

		return schema.validate(data);
	},
};
