const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require('../utils/responses');
const AppError = require("../utils/error-handlers/app-error");

function validateCreateAnswerRequest(req, res, next) {
    const { title, description, questionId } = req.body;
    const userId = req.user.id;

    const errors = [];

    if (!title) errors.push("title is required");
    if (!description) errors.push("description is required");
    if (!questionId) errors.push("questionId is required");
    if (!userId) errors.push("user ID is required");

    if (errors.length > 0) {
        ErrorResponse.message = "Invalid request for creating an answer";
        ErrorResponse.error = new AppError(errors, StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}

module.exports = { validateCreateAnswerRequest };
