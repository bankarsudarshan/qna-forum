const CrudRepository = require('./crud-repository');
const { User_Activity } = require('../../db/models');

class UserActivityRepository extends CrudRepository {
    constructor() {
        super(User_Activity);
    }
}

module.exports = UserActivityRepository;