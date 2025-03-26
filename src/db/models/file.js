'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  File.init({
    cloudinary_public_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING,
    },
    entity_type: {
      type: DataTypes.ENUM,
      values: ['question', 'answer'],
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'File',
    tableName: 'files',
    timestamps: false,
  });
  return File;
};