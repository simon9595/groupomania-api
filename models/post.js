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
    static associate(models){
      this.belongsTo(models.User, {foreignKey: 'userId'})
      this.hasOne(models.Seen, { foreignKey: 'postId'})
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
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};