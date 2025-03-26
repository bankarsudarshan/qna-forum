const { StatusCodes } = require("http-status-codes");
const { QuestionService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/responses");
const Cloudinary = require('../utils/cloudinary');
const { format } = require("sequelize/lib/utils");

/*
 * POST: /questions
 * description: Create a new question
 * req-body:
        {
            "title": "How does event loop work in Node.js?",
            "description": "I'm confused about the event loop in Node.js...",
            "userId": 123,
            "categories": ["javascript", "nodejs"],
            "parentQuestionId": null
        }
*/
async function questionControllerPOST(req, res) {
    try {
        const { title, description, userId, categories, parentQuestionId } = req.body;

        const numOfFiles = req.files.length;

        const questionData = {
            title,
            description,
            user_id: userId,
            num_of_files: numOfFiles,
            parent_question_id: parentQuestionId || null
        };

        const questionRes = await QuestionService.insertQuestion(questionData);

        // Insert categories
        const categoryRes = await QuestionService.addCategoriesToQuestion(questionRes, categories);

        // Upload files to Cloudinary
        let uploadedFiles = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const cloudinaryRes = await Cloudinary.uploadOnCloudinary(file.path);
                uploadedFiles.push({
                    cloudinary_public_id: cloudinaryRes.public_id,
                    url: cloudinaryRes.secure_url,
                    file_type: cloudinaryRes.resource_type,
                    entity_type: "question",
                    entity_id: questionRes.id
                });
            }
            console.log('exited for loop')
            console.log(uploadedFiles);
            // await FileService.storeFiles(uploadedFiles);
            // all files associated with question have been uploaded to cloudinary. Remove them from the server
        }

        SuccessResponse.message = "Successfully created a new question.";
        SuccessResponse.data = {
            questionRes,
            categoryRes,
            uploadedFiles
        };

        return res.status(StatusCodes.CREATED).json(SuccessResponse);

    } catch (error) {
        console.error("Error while creating question:", error);
        ErrorResponse.message = "Error occurred while inserting the question in database";
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

/*
 * GET: /questions
*/
async function questionControllerGETAll(req, res) {
    try {
        const questions = await QuestionService.getQuestions();
        SuccessResponse.data = questions;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

/*
 * GET: /questions/:questionId
 * example: /questions/34256
*/
async function questionControllerGET(req, res) {
    try {
        const question = await QuestionService.getQuestion(req.params.id);
        SuccessResponse.data = question;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse); 
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

/*
 * DELETE: /questions/:questionId
 * example: /questions/34256
*/
async function questionControllerDELETE(req, res) {
    try {
        const response = await QuestionService.deleteQuestion(req.params.id);
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function questionControllerUPDATE(req, res) {
    try {
        const data = new Object(req.body);
        const response = await QuestionService.updateQuestion(req.params.id, data);
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    questionControllerPOST,
    questionControllerGETAll,
    questionControllerGET,
    questionControllerDELETE,
    questionControllerUPDATE,
};