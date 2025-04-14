const { StatusCodes } = require("http-status-codes");
const { UserActivityRepository, EntityRepository } = require('../repositories');
const AppError = require("../utils/error-handlers/app-error");

const userActivityRepository = new UserActivityRepository();

async function createUserActivity(user_id, question_id) {
    try {
        const data = { user_id, question_id };
        const userActivity = await userActivityRepository.getOne(data);
        console.log(userActivity)
        if (userActivity) {
            // If the record exists, increment the view_count and update last_viewed_at
            await userActivityRepository.updateTuple(userActivity.id, {
              view_count: userActivity.view_count + 1,
              last_viewed_at: new Date(),
            });
        } else {
            // If no record exists, create a new one
            await userActivityRepository.insertTuple({
              user_id,
              question_id,
              view_count: 1,
              last_viewed_at: new Date(),
            });
        }
    } catch (error) {
        console.log('something went wrong in the view-service createUserActivity function:', error);
        throw new AppError("AppError", explanation, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createUserActivity,
};