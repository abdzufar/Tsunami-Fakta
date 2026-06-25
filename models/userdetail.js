'use strict';
const {
  Model
} = require('sequelize');
const formattedDate = require('../helpers/formattedDate');
const calculateAge = require('../helpers/calculateAge');
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

    get formattedBirthDate() {
      return formattedDate(this.birthDate);
    }

    get age() {
      return calculateAge(this.birthDate);
    }
  }
  UserDetail.init({
    UserId: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    bio: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'UserDetail',
  });
  return UserDetail;
};