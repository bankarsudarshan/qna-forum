'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer_Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Answer_Vote.init({
    answer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'answers',
        key: 'id'
      },
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    vote_type: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
   }, {
    sequelize,
    modelName: 'Answer_Vote',
    tableName: 'answer_votes',
    timestamps: false,
  });
  return Answer_Vote;
};