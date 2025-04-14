const { Question, Answer, Category, User_Activity } = require('../../db/models');

class UserRepository {
    async getCategoriesWRTInteractivity(userId) {
        try {
            // Subquery 1: Questions asked by user
            const questionsData = await Question.findAll({
                where: { user_id: userId },
                include: {
                    model: Category,
                    through: { attributes: [] },
                    attributes: ['id', 'name'],
                },
            });

            // Subquery 2: Answers written by user
            const answersData = await Answer.findAll({
                where: { user_id: userId },
                include: {
                    model: Question,
                    include: {
                        model: Category,
                        through: { attributes: [] },
                        attributes: ['id', 'name'],
                    }
                }
            });

            // Subquery 3: Views from user_activities
            const viewedQuestions = await User_Activity.findAll({
                where: { user_id: userId },
                include: {
                    model: Question,
                    include: {
                        model: Category,
                        through: { attributes: [] },
                        attributes: ['id', 'name'],
                    }
                }
            });

            return { questionsData, answersData, viewedQuestions };

        } catch (error) {
            console.error("Error in UserRepository.getCategoriesWRTInteractivity:", error);
            throw error;
        }
    }
}

module.exports = UserRepository;
