const { StatusCodes } = require("http-status-codes");
const { AnswerRepository } = require('../repositories');
const AppError = require("../utils/error-handlers/app-error");

const answerRepository = new AnswerRepository();

async function insertAnswer(data) {
    try {
        const answer = await answerRepository.insertTuple(data);
        return answer;
    } catch (error) {
        let explanation = [];
        if (error.errors) {
            error.errors.forEach((err) => {
                explanation.push(`answer's ${err.message}`);
            });
        }
        throw new AppError("AppError", explanation, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAnswersByQuestionId(questionId) {
    try {
        return await answerRepository.getAnswersByQuestionId(questionId);
    } catch (error) {
        throw new AppError("AppError", "Failed to fetch answers", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    insertAnswer,
    getAnswersByQuestionId
};
