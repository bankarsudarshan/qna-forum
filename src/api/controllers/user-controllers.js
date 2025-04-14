const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/responses');

async function getUsersActiveCategories(req, res) {
    try {
        const response = await UserService.getUsersActiveCategories(req.user.id);
        
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        console.log('something went wrong in getting users top categories');
        ErrorResponse.error = error;
        return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

async function getUnansweredFromActiveCategories(req, res) {
    try {
        const response = await UserService.getUnansweredFromActiveCategories(req.user.id);
        SuccessResponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        console.error('Error in controller:', error);
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    getUsersActiveCategories,
    getUnansweredFromActiveCategories,
}