const ShopSchema = require("../models/shop.model");

class ShopService {
	async increaseFavouriteQuantity(shopId, value) {
		try {
			const itemFound = await ShopSchema.findOne({
				_id: shopId,
			});
			if (!itemFound) {
				throw new Error(`Không tìm thấy ${shopId}`)
			}

			itemFound.favouriteQuantity += value;
			const saveResult = await itemFound.save();
		} catch (error) {
			console.error(error)
			return error
		}
	}

	async decreaseFavouriteQuantity(shopId, value) {
		try {
			const itemFound = await ShopSchema.findOne({
				_id: shopId,
			});
			if (!itemFound) {
				throw new Error(`Không tìm thấy ${shopId}`)
			}

			itemFound.favouriteQuantity -= value;
			if (itemFound.favouriteQuantity < 0) {
				itemFound.favouriteQuantity = 0
			}
			const saveResult = await itemFound.save();
		} catch (error) {
			console.error(error)
			return error
		}
	}
}

module.exports = new ShopService();
