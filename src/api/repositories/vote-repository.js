const CrudRepository = require('./crud-repository');
const { Question_Vote, Answer_Vote } = require('../../db/models');

class VoteRepository extends CrudRepository {
    constructor() {
        // We don't set a default model in constructor since it depends on entityType
        super();
    }

    getModelForEntity(entityType) {
        if (entityType === 'questions') {
            return Question_Vote;
        } else if (entityType === 'answers') {
            return Answer_Vote;
        } else {
            throw new Error(`Invalid entity type: ${entityType}`);
        }
    }

    async getVote(entityType, entityId, userId) {
        const model = this.getModelForEntity(entityType);
        const columnName = entityType === 'questions' ? 'question_id' : 'answer_id';
        
        const vote = await model.findOne({
            where: {
                [columnName]: entityId,
                user_id: userId
            }
        });
        
        return vote;
    }

    async createVote(entityType, data) {
        const model = this.getModelForEntity(entityType);
        const columnName = entityType === 'questions' ? 'question_id' : 'answer_id';
        
        const voteData = {
            [columnName]: data.entityId,
            user_id: data.userId,
            vote_type: data.voteType
        };
        
        return await model.create(voteData);
    }

    async updateVote(vote, newVoteType) {
        return await vote.update({ vote_type: newVoteType });
    }

    async deleteVote(vote) {
        return await vote.destroy();
    }
}

module.exports = VoteRepository;