const { StatusCodes } = require("http-status-codes");
const { getCategories } = require("../services/category-service");
const { SuccessResponse, ErrorResponse } = require("../utils/responses");

/*
 * GET: /categories
 * Description: Get all categories
 */
async function categoryControllerGETAll(req, res) {
    try {
        const categories = await getCategories();

        SuccessResponse.message = "Successfully fetched all categories.";
        SuccessResponse.data = categories;

        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        console.error("Error fetching categories:", error);

        ErrorResponse.message = "Error while fetching categories.";
        ErrorResponse.error = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    categoryControllerGETAll,
};
