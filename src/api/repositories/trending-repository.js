const { Category, Question_Categories, Question, Question_Vote } = require('../../db/models');
const { Op } = require('sequelize');

class TrendingRepository {
    async getTrendingData() {
        try {
            const categories = await Category.findAll();

            const results = [];

            for (const category of categories) {
                // Step 1: Get all question_ids linked to this category
                const qLinks = await Question_Categories.findAll({
                    where: { category_id: category.id },
                    attributes: ['question_id']
                });

                const questionIds = qLinks.map(q => q.question_id);

                // Step 2: Get total upvotes for these questions
                const upvotes = await Question_Vote.count({
                    where: {
                        question_id: { [Op.in]: questionIds },
                        vote_type: true
                    }
                });

                // Step 3: Calculate score
                const result = {
                    id: category.id,
                    name: category.name,
                    questionCount: questionIds.length,
                    totalUpvotes: upvotes,
                    score: questionIds.length + upvotes
                };

                results.push(result);
            }

            // Step 4: Sort and return top 3
            results.sort((a, b) => b.score - a.score);
            return results.slice(0, 3);

        } catch (error) {
            console.log("Error in getTrendingData:", error);
            throw error;
        }
    }
}

module.exports = TrendingRepository;
