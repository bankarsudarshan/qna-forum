const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require('../utils/responses');
const AppError = require("../utils/error-handlers/app-error");

function validateCreateRequest(req, res, next) {

    console.log(req.body);
    const { title, description, categories, userId } = req.body;

    const errors = [];

    if (!title) {
        errors.push("title is required");
    }
    if (!description) {
        errors.push("description is required");
    }
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        errors.push("at least one category is required");
    }
    if (!userId) {
        errors.push("user ID is required");
    }

    if (errors.length > 0) {
        ErrorResponse.message = "invalid request for creating a question";
        ErrorResponse.error = new AppError(errors, StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }

    next();
}

module.exports = { validateCreateRequest };
