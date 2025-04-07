const CrudRepository = require('./crud-repository');
const { File } = require('../../db/models');

class FileRepository extends CrudRepository {
    constructor() {
        super(File);
    }

    async fetchFiles(entityType, entityId) {
        try {
            const associatedFiles = await File.findAll({
                where: {
                    entity_id: entityId,
                    entity_type: entityType,
                }
            });
            return associatedFiles;
        } catch (error) {
            console.log('something went wrong while fetching files. Error: ', error);
        }
    }

}

module.exports = FileRepository;