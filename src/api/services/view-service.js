const { StatusCodes } = require("http-status-codes");
const { UserActivityRepository, EntityRepository } = require('../repositories');
const AppError = require("../utils/error-handlers/app-error");

const userActivityRepository = new UserActivityRepository();
const entityRepository = new EntityRepository();

async function createUserActivity(user_id, entity_type, entity_id) {
    try {
        entity_type = await entityRepository.getEntityType(entity_type);
        const data = {
            user_id,
            entity_id,
            entity_type,
        }
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
              entity_id,
              entity_type,
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