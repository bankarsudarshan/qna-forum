const { StatusCodes } = require("http-status-codes");
const { FileRepository } = require('../repositories');
const AppError = require("../utils/error-handlers/app-error");

const fileRepository = new FileRepository();

async function insertFiles(files) {
    try {
        const response = await Promise.all(
            files.map(async (file) => {
                const result = await insertFile(file);
                return result;
            })
        )
        return response;
    } catch (error) {
        // console.log("got error ", error);
        throw error;
    }
}

async function insertFile(file) {
    try {
        const response = await fileRepository.insertTuple(file);
        return response;
    } catch (error) {
        console.log("got error ", error);
        let explanation = [error.message];
        if (error.name == "SequelizeValidationError") {
            error.errors.forEach((err) => {
                explanation.push(`file's ${err.message}`);
            });
            throw new AppError("DatabaseValidationError", explanation, StatusCodes.BAD_REQUEST);
        } else if (error.name == "SequelizeUniqueConstraintError") {
            error.errors.forEach((err) => {
                explanation.push(`file's ${err.message}`);
            });
            throw new AppError("DatabaseUniqueConstraintError", explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError("AppError", explanation, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    insertFile,
    insertFiles,
};