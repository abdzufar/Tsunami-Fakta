'use strict';
const {
  Model,
  where
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.UserDetail);
      User.hasMany(models.Article, {
        foreignKey: 'AuthorId',
        as: 'AuthoredArticles'
      });
      User.belongsToMany(models.Article, {
        through: models.ArticleBookmark,
        foreignKey: 'UserId',
        as: 'BookmarkedArticles'
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Username tidak boleh kosong."
        },
        notEmpty: {
          msg: "Username tidak boleh Null."
        },
        async isUniqueUsername(username) {
          const existingUsername = await sequelize.models.User.findOne({
            where: {
              username
            }
          });
          if (existingUsername) throw new Error("Username sudah pernah digunakan.")
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "E-mail tidak boleh kosong."
        },
        notEmpty: {
          msg: "E-mail tidak boleh Null."
        },
        isEmail: {
          msg: "Format E-mail tidak valid"
        },
        async isUniqueEmail(email) {
          const existingEmail = await sequelize.models.User.findOne({
            where: {
              email
            }
          });
          if (existingEmail) throw new Error("E-mail sudah pernah digunakan.")
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password tidak boleh kosong."
        },
        notEmpty: {
          msg: "Password tidak boleh Null."
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role tidak boleh kosong."
        },
        notEmpty: {
          msg: "Role tidak boleh Null."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, 10);
      }
    }
  });
  return User;
};