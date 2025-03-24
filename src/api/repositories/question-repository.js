const CrudRepository = require('./crud-repository');
const { Question } = require('../../db/models');

class QuestionRepository extends CrudRepository {
    constructor() {
        super(Question);
    }
}

module.exports = QuestionRepository;