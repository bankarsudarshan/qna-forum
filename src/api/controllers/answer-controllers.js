const { StatusCodes } = require("http-status-codes");
const { AnswerService, FileService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/responses");
const Cloudinary = require("../utils/cloudinary");
const fs = require("fs");

async function answerControllerPOST(req, res) {
    try {
        const { title, description, questionId } = req.body;
        const userId = req.user.id;

        const numOfFiles = req.files.length;

        const answerData = {
            title,
            description,
            question_id: questionId,
            user_id: userId,
            num_of_files: numOfFiles,
        };

        const answerRes = await AnswerService.insertAnswer(answerData);

        let uploadedFiles = [];
        let filePaths = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const cloudinaryRes = await Cloudinary.uploadOnCloudinary(file.path);
                uploadedFiles.push({
                    cloudinary_public_id: cloudinaryRes.public_id,
                    url: cloudinaryRes.secure_url,
                    file_type: cloudinaryRes.resource_type,
                    entity_type: 'answer',
                    entity_id: answerRes.id,
                });
                filePaths.push(file.path);
            }
        }
        const filesRes = await FileService.insertFiles(uploadedFiles);
        for (let filePath of filePaths) {
            fs.unlinkSync(filePath);
        }

        SuccessResponse.message = "Successfully created a new answer.";
        SuccessResponse.data = {
            answerRes,
            filesRes,
        };

        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        console.error("Error while creating answer:", error);
        ErrorResponse.message = "Error occurred while inserting the answer in database";
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function getAnswersByQuestion(req, res) {
    try {
        const questionId = req.params.questionId;
        const answers = await AnswerService.getAnswersByQuestionId(questionId);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Answers fetched successfully",
            data: answers,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    answerControllerPOST,
    getAnswersByQuestion,
};
