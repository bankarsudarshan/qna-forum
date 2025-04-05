const CrudRepository = require('./crud-repository');
const { Answer } = require('../../db/models');

class AnswerRepository extends CrudRepository {
    constructor() {
        super(Answer);
    }

    async getAnswersByQuestionId(questionId) {
        try {
            const answers = await Answer.findAll({ where: { question_id: questionId } });
            return answers;
        } catch (error) {
            console.error("Error in getAnswersByQuestionId:", error);
            throw error;
        }
    }
}

module.exports = AnswerRepository;
