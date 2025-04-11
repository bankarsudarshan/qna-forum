const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/responses");
const { VoteService } = require("../services");
const { getQuestion } = require("../services/question-service");

async function vote(req, res) {
  const urlComponentsArray = req.originalUrl.split('/');
  const entityType = urlComponentsArray[3]; // 'questions' or 'answers'

  try {
    const data = {
      entityId: req.params.id,
      userId: req.user.id,
      voteType: req.body.voteType === 'up' ? true : false,
    };

    await VoteService.vote(entityType, data);

    if (entityType === 'questions') {
      const updatedQuestion = await getQuestion(data.entityId);
      SuccessResponse.message = "Vote was registered successfully.";
      console.log(updatedQuestion);
      SuccessResponse.data = updatedQuestion;
      return res.status(StatusCodes.CREATED).json(SuccessResponse);
    }

    SuccessResponse.message = "Vote was registered successfully.";
    SuccessResponse.data = null;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);

  } catch (error) {
    console.error("Error while voting:", error);
    ErrorResponse.message = "Error occurred while voting";
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

module.exports = {
  vote,
};
