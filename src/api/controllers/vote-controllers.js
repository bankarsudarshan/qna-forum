const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/responses");
const { VoteService } = require("../services");

async function vote(req, res) {

    const urlComponentsArray = req.originalUrl.split('/');
    const entityType = urlComponentsArray[3];

    try {
        const data = {
            entityId: req.params.id,
            userId: req.user.id,
            voteType: req.body.voteType == 'up' ? true : false,
        };
        const response = await VoteService.vote(entityType, data);

        SuccessResponse.message = "Vote was registered successfully.";
        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);

    } catch (error) {
        console.error("Error while voting:", error);
        ErrorResponse.message = "Error occurred while voting";
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    vote,
};
