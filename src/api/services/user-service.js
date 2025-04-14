const { UserRepository, QuestionRepository, AnswerRepository } = require('../repositories');

const userRepository = new UserRepository();
const questionRepository = new QuestionRepository();

async function getUsersActiveCategories(userId) {
    try {

        const { questionsData, answersData, viewedQuestions } = await userRepository.getCategoriesWRTInteractivity(userId);
        const categoryInteractionMap = new Map();

        // Helper to update scores
        function addToCategory(categoryList, weight) {
            categoryList.forEach(cat => {
                const prev = categoryInteractionMap.get(cat.id) || { name: cat.name, score: 0 };
                categoryInteractionMap.set(cat.id, {
                    name: cat.name,
                    score: prev.score + weight
                });
            });
        }

        // Aggregate scores
        questionsData.forEach(q => addToCategory(q.Categories, 3)); // Asked questions: weight 3
        answersData.forEach(ans => {
            if (ans.Question && ans.Question.Categories) {
                addToCategory(ans.Question.Categories, 4); // Answered: weight 4
            }
        });
        viewedQuestions.forEach(view => {
            if (view.Question && view.Question.Categories) {
                addToCategory(view.Question.Categories, 1); // Viewed: weight 1
            }
        });

        // Convert map to array, sort by score
        const result = Array.from(categoryInteractionMap.entries())
            .map(([id, data]) => ({
                id,
                name: data.name,
                score: data.score
            }))
            .sort((a, b) => b.score - a.score);
        return result;
    } catch (error) {
        console.log('something went wrong in the services layer:', error);
        throw error;
    }
}

async function getUnansweredFromActiveCategories(userId) {
    try {
        // 1. Step: Get user's most active categories
        const activeCategories = await getUsersActiveCategories(userId);
        console.log(activeCategories);
        const categoryIds = activeCategories.map(c => c.id);

        if (categoryIds.length === 0) return [];

        // 2. Step: Fetch unanswered questions in those categories
        const questions = await questionRepository.getUnansweredQuestionsByCategories(categoryIds);

        return questions;
    } catch (error) {
        console.log('Error in getUnansweredFromActiveCategories');
        throw error;
    }
}


module.exports = {
    getUsersActiveCategories,
    getUnansweredFromActiveCategories,
}