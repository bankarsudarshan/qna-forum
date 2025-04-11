'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Category, {
        through: 'question_categories',
        foreignKey: 'question_id',
        otherKey: 'category_id',
        sourceKey: 'id',
        timestamps: false,
      });
      this.hasMany(models.Answer, {
        foreignKey: 'question_id',
        sourceKey: 'id',
      });
      this.hasMany(models.Question_Vote, {
        foreignKey: 'question_id',
        sourceKey: 'id',
      });
    }
  }
  Question.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    num_of_files: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 3,
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_question_id: {
      type: DataTypes.INTEGER
    },
    num_of_answers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    closed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    vote_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'questions'
  });
  return Question;
};