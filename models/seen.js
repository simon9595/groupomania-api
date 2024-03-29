'use strict';
const {
  Model
} = require('sequelize');
const post = require('./post');
module.exports = (sequelize, DataTypes) => {
  class Seen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Post, {through: 'posts'})
      this.belongsToMany(models.User, {through: 'users'})
    }
  };
  Seen.init({
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false}
  }, {
    sequelize,
    modelName: 'Seen',
  });
  return Seen;
};