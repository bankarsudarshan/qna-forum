const CrudRepository = require('./crud-repository');
const { Category } = require('../../db/models');

class CategoryRepository extends CrudRepository {
    constructor() {
        super(Category);
    }

    /*
    input -> array of strings
    output -> array of integers(category ids) 
    */
    async getCategoryIds(categories) {
        try {
            const categoryIds = await Promise.all(
                categories.map(async (category) => {
                    const result = await this.model.findOne({
                        where: {
                            name: category,
                        },
                        attributes: ['id'],
                    });
                    return result ? result.id : null; // Ensure it returns the ID, or null if not found
                })
            );
            return categoryIds.filter(id => id !== null); // Remove null values if any category is not found
        } catch (error) {
            console.log('something went wrong in the getCategoryIds function in CategoryRepository');
            throw error;
        }
    }
    

    /*
    input -> category name
    output -> category id 
    */   
    async getCategoryId(category) {
        try {
            const id = await this.model.findOne({
                where: {
                    name: category,
                },
                attributes: id,
            })
        } catch (error) {
            console.log('something went wrong in the getCategoryId function in CategoryRepository');
            throw error;
        }
    }
}

module.exports = CategoryRepository;