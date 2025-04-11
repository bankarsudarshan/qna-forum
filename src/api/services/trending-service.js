const TrendingRepository = require('../repositories/trending-repository');
const AppError = require('../utils/error-handlers/app-error');
const { StatusCodes } = require('http-status-codes');

const trendingRepository = new TrendingRepository();

async function getTrendingCategories() {
    try {
        const trending = await trendingRepository.getTrendingData();
        return trending;
    } catch (error) {
        throw new AppError("Failed to fetch trending categories", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    getTrendingCategories
};
