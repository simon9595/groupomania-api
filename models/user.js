'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Post, { foreignKey: 'userId'})
      this.hasMany(models.Seen, {foreignKey: 'userId'})
    }
    toJSON(){
      return {...this.get(), password: undefined }
    }
  };
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true },
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true },
    password: { 
      type: DataTypes.STRING,
      allowNull: false },
    isAdmin:{ 
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};