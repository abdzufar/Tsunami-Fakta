'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserDetail.belongsTo(models.User)
    }
  }
  UserDetail.init({
    UserId: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    birthDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserDetail',
  });
  return UserDetail;
};