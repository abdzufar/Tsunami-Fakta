'use strict';
const {
  Model,
  where
} = require('sequelize');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
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
        foreignKey: 'AuthorId'
      });
      User.belongsToMany(models.Article, {
        through: models.ArticleBookmark,
        foreignKey: 'UserId',
        as: 'BookmarkedArticles'
      });
    }

    static async getBookmarksOfUser(currentUser, userInput) {
      const where1 = {};
      const where2 = {};
      if (userInput.searchQuery) where1.title = { [Op.iLike]: `%${userInput.searchQuery}%` };
      if (userInput.categoryId) where2.id = +userInput.categoryId;
      let data = await User.findByPk(currentUser.id, {
        attributes: [],
        include: {
          model: sequelize.models.Article,
          as: "BookmarkedArticles",
          include: {
            model: sequelize.models.Category,
            where: where2,
          },
          where: where1,
        },
      });
      data = data ? data.BookmarkedArticles : [];
      return data;
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
      },
      afterCreate: async (user, options) => {
        await sequelize.models.UserDetail.create({
          UserId: user.id,
          birthDate: new Date("1970-01-01"),
          fullName: "John Doe",
          bio: "Hai, aku pendaftar baru di sini."
        })
      }
    }
  });
  return User;
};