'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      // define association here
      this.hasMany(Post, { foreignKey: 'userId'})
    }
    toJSON(){
      return {...this.get(), password: undefined }
    }
  };
  User.init({
    username: { 
      type: DataTypes.STRING,
      allowNull: false },
    email: { 
      type: DataTypes.STRING,
      allowNull: false },
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