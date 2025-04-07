    const CrudRepository = require('./crud-repository');
    const { Question, Question_Categories, Category } = require('../../db/models');

    class QuestionRepository extends CrudRepository {
        constructor() {
            super(Question);
        }

        async getAllQuestions() {
            try {
                const questions = await this.model.findAll();
                return questions;
            } catch (error) {
                console.log("got error: ", error);
            }
        }

        async getQuestion(questionId) {
            try {
                const question = await this.model.findOne({
                    where: {id: questionId},
                    include: {
                        model: Category,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        through: {
                            attributes: [],
                        }
                    },
                });
                return question;
            } catch (error) {
                console.log("got error: ", error);
            }
        }


        async getQuestionsByCategory(categoryName) {  // ✅ No "function" keyword
            try {
                // Step 1: Get category ID
                const category = await Category.findOne({
                    where: { name: categoryName.trim() },  // ✅ trim() added here
                    attributes: ["id"],
                });
                

                if (!category) {
                    return []; // No such category exists
                }

                // Step 2: Get all question IDs from question_categories table
                const questionCategories = await Question_Categories.findAll({
                    where: { category_id: category.id }, // use snake_case column names
                    attributes: ["question_id"],
                });
                

                const questionIds = questionCategories.map(qc => qc.question_id);


                if (questionIds.length === 0) {
                    return []; // No questions in this category
                }

                // Step 3: Fetch questions based on retrieved IDs
                const questions = await Question.findAll({
                    where: { id: questionIds },
                });

                return questions;
            } catch (error) {
                console.error("Error in getQuestionsByCategory:", error);
                throw error;
            }
        }
    }

    module.exports = QuestionRepository;
