import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: SequelizeStatic) {
    return queryInterface.sequelize.transaction(async _t => {
      await queryInterface.createTable('QuestionCategory', {
        id: {
          type: Sequelize.TEXT,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        version: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      });

      await queryInterface.createTable('QuestionLevel', {
        id: {
          type: Sequelize.TEXT,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        version: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      });

      await queryInterface.createTable('QuestionStatus', {
        id: {
          type: Sequelize.TEXT,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        version: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      });

      await queryInterface.createTable('UserRole', {
        id: {
          type: Sequelize.TEXT,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        version: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      });

      await queryInterface.createTable('User', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        email: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: true,
        },
        firstName: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        lastName: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        _roleId: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: 'user',
          references: {
            model: 'UserRole',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        version: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      });

      await queryInterface.createTable('Question', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        question: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: true,
        },
        acceptedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        _categoryId: {
          type: Sequelize.TEXT,
          allowNull: false,
          references: {
            model: 'QuestionCategory',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        _levelId: {
          type: Sequelize.TEXT,
          allowNull: false,
          references: {
            model: 'QuestionLevel',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        _statusId: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: 'pending',
          references: {
            model: 'QuestionStatus',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        version: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      });
    });
  },

  async down(queryInterface: QueryInterface, _Sequelize: SequelizeStatic) {
    await queryInterface.dropAllTables();
  },
};
