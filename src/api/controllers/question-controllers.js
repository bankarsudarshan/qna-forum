const { StatusCodes } = require("http-status-codes");
const { QuestionService, FileService, ViewService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/responses");
const Cloudinary = require('../utils/cloudinary');
const fs = require('fs');

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
        
        const { title, description, parentQuestionId } = req.body;
        const userId = req.user.id;

        const categories = Array.isArray(req.body.categories) ? req.body.categories : [req.body.categories];

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
        let filePaths = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const cloudinaryRes = await Cloudinary.uploadOnCloudinary(file.path);
                uploadedFiles.push({
                    cloudinary_public_id: cloudinaryRes.public_id,
                    url: cloudinaryRes.secure_url,
                    file_type: cloudinaryRes.resource_type,
                    entity_type: 'question',
                    entity_id: questionRes.id,
                });
                filePaths.push(file.path) //used for fs.unlinkSync later
            }
        }
        const filesRes = await FileService.insertFiles(uploadedFiles);
        // all files associated with question have been uploaded to cloudinary. Remove them from the server
        for(let filePath of filePaths) {
            fs.unlinkSync(filePath);
        }

        SuccessResponse.message = "Successfully created a new question.";
        SuccessResponse.data = {
            questionRes,
            categoryRes,
            filesRes
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
 * GET: /questions/:id
 * example: /questions/34256
*/
async function questionControllerGET(req, res) {
    try {
        const question = await QuestionService.getQuestion(req.params.id);
        if(req.user && req.user.id) {
            // if the user is signed in / if the request is coming via the auth-middleware
            await ViewService.createUserActivity(req.user.id, req.params.id);
        }
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

async function fetchQuestionsByCategory(req, res) {
    try {
        const { categoryName } = req.params;
        const questions = await QuestionService.getQuestionsByCategory(categoryName);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Questions fetched successfully",
            data: questions,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
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
    fetchQuestionsByCategory
};