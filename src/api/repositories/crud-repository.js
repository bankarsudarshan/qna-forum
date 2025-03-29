const { StatusCodes } = require("http-status-codes");
const AppError = require('../utils/error-handlers/app-error')

class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    // this method of the class CrudRepository will insert the 'data' in the table corresponding to 'model'
    async insertTuple(data) {
        const response = await this.model.create(data);
        return response;
    }

    async deleteTuple(dataId) {
        const response = await this.model.destroy({
            where: {
                id: dataId,
            },
        });
        return response;
    }

    async getTuple(dataId) {
        const response = await this.model.findByPk(dataId);
        return response;
    }

    async getAllTuples(dataId) {
        const response = await this.model.findAll(dataId);
        return response;
    }      

    async updateTuple(id, data) {
        // data -> {col: val, ...}
        const response = await this.model.update(data, {
            where: { id: id, },
            returning: true,
        });
        console.log(response);
        // response: [ affectedRowsCount, [array of affectedRows] ]
        // console.log(response instanceof Array); // true
        if(response[0] === 0) {
            throw new AppError('Resource does not exist to update', StatusCodes.NOT_FOUND);
        }
        return response;
    }
}

module.exports = CrudRepository;