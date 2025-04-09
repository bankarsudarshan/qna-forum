const { StatusCodes } = require("http-status-codes");
const { QuestionRepository, AnswerRepository, VoteRepository } = require('../repositories');
const AppError = require("../utils/error-handlers/app-error");

const voteRepository = new VoteRepository();
const questionRepository = new QuestionRepository();
const answerRepository = new AnswerRepository();

async function vote(entityType, data) {
    try {
        // Get the content entity (question or answer)
        let contentEntity;
        if (entityType === 'questions') {
            contentEntity = await questionRepository.getTuple(data.entityId);
        } else if (entityType === 'answers') {
            contentEntity = await answerRepository.getTuple(data.entityId);
        } else {
            throw new AppError('InvalidEntityType', `Entity type ${entityType} is not supported`, StatusCodes.BAD_REQUEST);
        }

        if (!contentEntity) {
            throw new AppError('NotFoundError', `${entityType.slice(0, -1)} with id ${data.entityId} not found`, StatusCodes.NOT_FOUND);
        }

        // Check if user has already voted
        const existingVote = await voteRepository.getVote(entityType, data.entityId, data.userId);

        // Calculate vote value for updating counters
        const incomingVoteValue = data.voteType === true ? 1 : -1;
        const earlierVoteCount = contentEntity.dataValues.vote_count;
        
        if (existingVote) {
            // User has voted before
            if (existingVote.vote_type == data.voteType) {
                // Same vote type - remove the vote (toggle off)
                await voteRepository.deleteVote(existingVote);
                await contentEntity.update({ vote_count: earlierVoteCount - incomingVoteValue });
                
                return {
                    action: 'removed',
                    voteType: data.voteType ? 'upvote' : 'downvote',
                    entityType,
                    entityId: data.entityId,
                    newVoteCount: earlierVoteCount - incomingVoteValue
                };
            } else {
                // Different vote type - update vote
                await voteRepository.updateVote(existingVote, data.voteType);
                await contentEntity.update({ vote_count: earlierVoteCount + incomingVoteValue*2 }); // Double because we're flipping (+2 or -2)
                
                return {
                    action: 'updated',
                    voteType: data.voteType ? 'upvote' : 'downvote',
                    entityType,
                    entityId: data.entityId,
                    newVoteCount: earlierVoteCount + incomingVoteValue*2
                };
            }
        } else {
            // First time voting - create new vote
            await voteRepository.createVote(entityType, data);
            await contentEntity.update({ vote_count: earlierVoteCount + incomingVoteValue });
            
            return {
                action: 'created',
                voteType: data.voteType ? 'upvote' : 'downvote',
                entityType,
                entityId: data.entityId,
                newVoteCount: earlierVoteCount + incomingVoteValue
            };
        }
        
    } catch (error) {        
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(error.name, explanation, StatusCodes.BAD_REQUEST);
        }
        
        // Rethrow AppErrors as-is
        if (error.name === "AppError") {
            throw error;
        }
        
        throw new AppError("VoteError", "Failed to process vote", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteVote(entityType, entityId, userId) {
    try {
        const vote = await voteRepository.getVote(entityType, entityId, userId);
        if (!vote) {
            throw new AppError('NotFoundError', 'Vote not found', StatusCodes.NOT_FOUND);
        }
        
        await voteRepository.deleteVote(vote);
        return { success: true };
    } catch (error) {
        if (error.name === "AppError") {
            throw error;
        }
        throw new AppError('DeleteVoteError', 'Cannot delete the vote', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    vote,
    deleteVote
};