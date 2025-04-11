const CrudRepository = require('./crud-repository');
const { User_Activity } = require('../../db/models');
const AppError = require('../utils/error-handlers/app-error');

class UserActivityRepository extends CrudRepository {
    constructor() {
        super(User_Activity);
    }
}

module.exports = UserActivityRepository;