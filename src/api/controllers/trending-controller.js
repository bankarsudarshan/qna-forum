const { StatusCodes } = require("http-status-codes");
const TrendingService = require("../services/trending-service");
const { SuccessResponse, ErrorResponse } = require("../utils/responses");

async function fetchTrendingCategories(req, res) {
    try {
        const trending = await TrendingService.getTrendingCategories();
        SuccessResponse.data = trending;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    fetchTrendingCategories
};
