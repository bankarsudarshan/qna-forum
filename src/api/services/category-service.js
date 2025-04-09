const { StatusCodes } = require("http-status-codes");
const { CategoryRepository } = require('../repositories');
const AppError = require("../utils/error-handlers/app-error");

const categoryRepository = new CategoryRepository();

async function insertCategory(data) {
    try {
        const category = await categoryRepository.insertTuple(data);
        return category;
    } catch (error) {
        // console.log("got error ", error);
        let explanation = [];
        error.errors.forEach((err) => {
            explanation.push(`category's ${err.message}`);
        });
        if (error.name == "SequelizeValidationError") {
            throw new AppError("DatabaseValidationError", explanation, StatusCodes.BAD_REQUEST);
        } else if (error.name == "SequelizeUniqueConstraintError") {
            throw new AppError("DatabaseUniqueConstraintError", explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError("AppError", explanation, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getCategories() {
    try {
        const categories = await categoryRepository.getAllTuples({});
        return categories;
    } catch(error) {
        throw new AppError('Cannot fetch all categories', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getCategory(id) {
    try {
        const category = await categoryRepository.getTuple(id);
        return category;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError('Required category not found', error.statusCode);
        }
        throw new AppError('Cannot get the category', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}




module.exports = {
    insertCategory,
    getCategories,
    getCategory,
};