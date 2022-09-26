'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId'})
    }
  };
  Post.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false },
    attachment: DataTypes.STRING,
    text: {
      type: DataTypes.TEXT,
      defaultValue: '',
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0},
    likedUsers: { 
      type: DataTypes.STRING,
      defaultValue: ''},
    comments: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};