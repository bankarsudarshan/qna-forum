const CrudRepository = require('./crud-repository');
const { Entity } = require('../../db/models');

class EntityRepository extends CrudRepository {
    constructor() {
        super(Entity);
    }

    async getEntityType(entity_type) {
        try {
            const entity = await Entity.findOne({ where: { name: entity_type } });
            return entity.id;
        } catch (error) {
            console.error("Error in entity-repository getEntityId function:", error);
            throw error;
        }
    }
}

module.exports = EntityRepository;
