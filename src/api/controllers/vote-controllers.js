const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/responses");
const { VoteService } = require("../services");
const { getQuestion } = require("../services/question-service");
const { getAnswer } = require("../services/answer-service");

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

    let updatedEntity = null;

    if (entityType === 'questions') {
      updatedEntity = await getQuestion(data.entityId);
    } else if (entityType === 'answers') {
      updatedEntity = await getAnswer(data.entityId);
    }

    console.log(updatedEntity)

    SuccessResponse.message = "Vote was registered successfully.";
    SuccessResponse.data = updatedEntity;
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
