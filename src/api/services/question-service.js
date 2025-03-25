const { StatusCodes } = require("http-status-codes");
const { QuestionRepository } = require('../repositories');
const AppError = require("../utils/error-handlers/app-error");

const questionRepository = new QuestionRepository();

async function insertQuestion(data) {
    try {
        const question = await questionRepository.insertTuple(data);
        return question;
    } catch (error) {
        // console.log("got error ", error);
        let explanation = [];
        error.errors.forEach((err) => {
            explanation.push(`question's ${err.message}`);
        });
        if (error.name == "SequelizeValidationError") {
            throw new AppError("DatabaseValidationError", explanation, StatusCodes.BAD_REQUEST);
        } else if (error.name == "SequelizeUniqueConstraintError") {
            throw new AppError("DatabaseUniqueConstraintError", explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError("AppError", explanation, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getQuestions() {
    try {
        const questions = await questionRepository.getAllTuples();
        return questions;
    } catch(error) {
        throw new AppError('Cannot fetch all questions', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getQuestion(id) {
    try {
        const question = await questionRepository.getTuple(id);
        return question;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError('Required question not found', error.statusCode);
        }
        throw new AppError('Cannot get the question', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteQuestion(id) {
    try {
        const response = await questionRepository.deleteTuple(id);
        return response;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError('Required question does not exist to delete', error.statusCode);
        }
        throw new AppError('Cannot delete the question', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateQuestion(id, data) { // this will update the capacity of the question
    try {
        const response = await questionRepository.updateTuple(id, data);
        return response;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError('Required question does not exist to update', error.statusCode);
        }
        throw new AppError('Cannot update question', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    insertQuestion,
    getQuestions,
    getQuestion,
    deleteQuestion,
    updateQuestion,
};