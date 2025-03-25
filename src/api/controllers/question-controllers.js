const { StatusCodes } = require("http-status-codes");
const { QuestionService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils");
const Cloudinary = require('../utils/cloudinary');

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

        const question = await QuestionService.insertQuestion(questionData);

        // Insert categories
        console.log(categories);
        // const categoryIds = await CategoryService.addCategoriesToQuestion(question.id, categories);

        // Upload files to Cloudinary
        let uploadedFiles = [];
        if (anyFiles) {
            for (const file of req.files) {
                const cloudinaryUrl = await Cloudinary.uploadOnCloudinary(file.path);
                uploadedFiles.push({
                    user_id: userId,
                    url: cloudinaryUrl,
                    file_type: file.mimetype,
                    entity_type: "question",
                    entity_id: question.id
                });

                // Delete file from local storage after successful upload
                // fs.unlinkSync(file.path);
            }
            console.log(uploadedFiles);
            // await FileService.storeFiles(uploadedFiles);
        }

        SuccessResponse.message = "Successfully created a new question.";
        SuccessResponse.data = {
            question,
            categories,
            uploadedFiles
        };

        return res.status(StatusCodes.CREATED).json(SuccessResponse);

    } catch (error) {
        console.error("Error while creating question:", error);
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
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