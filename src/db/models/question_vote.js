'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question_Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Question, {
        foreignKey: 'question_id',
        targetKey: 'id',
      });
    }
  }
  Question_Vote.init({
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'questions',
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
    modelName: 'Question_Vote',
    tableName: 'question_votes',
    timestamps: false,
  });
  return Question_Vote;
};