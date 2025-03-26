const CrudRepository = require('./crud-repository');
const { File } = require('../../db/models');

class FileRepository extends CrudRepository {
    constructor() {
        super(File);
    }
}

module.exports = FileRepository;