const CrudRepository = require('./crud-repository');
const { Answer, Sequelize } = require('../../db/models');

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

  async getAnswerWithVotes(answerId) {
    try {
      const answer = await Answer.findOne({
        where: { id: answerId },
        attributes: {
            include: [
              [
                Sequelize.literal(`(
                  SELECT COUNT(*) 
                  FROM answer_votes av1
                  WHERE av1.answer_id = "Answer"."id" 
                    AND vote_type = true
                ) - (
                  SELECT COUNT(*) 
                  FROM answer_votes av2
                  WHERE av2.answer_id = "Answer"."id" 
                    AND vote_type = false
                )`),
                'vote_count'
              ]
            ]
          }
          
      });
      return answer;
    } catch (error) {
      console.error("Error in getAnswerWithVotes:", error);
      throw error;
    }
  }
}

module.exports = AnswerRepository;
