'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Atualiza a tabela Movies para adicionar trailer_url
    await queryInterface.addColumn('Movies', 'trailer_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Cria a tabela Genres
    await queryInterface.createTable('Genres', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Cria a tabela Casts
    await queryInterface.createTable('Casts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      character: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Cria a tabela Directors
    await queryInterface.createTable('Directors', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Cria a tabela Networks
    await queryInterface.createTable('Networks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Cria a tabela Keywords
    await queryInterface.createTable('Keywords', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Cria a tabela MovieGenre para associação
    await queryInterface.createTable('MovieGenre', {
      movie_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Movies',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      genre_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Genres',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Cria a tabela MovieCast para associação
    await queryInterface.createTable('MovieCast', {
      movie_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Movies',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      cast_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Casts',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Cria a tabela MovieDirector para associação
    await queryInterface.createTable('MovieDirector', {
      movie_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Movies',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      director_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Directors',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Cria a tabela MovieNetwork para associação
    await queryInterface.createTable('MovieNetwork', {
      movie_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Movies',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      network_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Networks',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Cria a tabela MovieKeyword para associação
    await queryInterface.createTable('MovieKeyword', {
      movie_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Movies',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      keyword_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Keywords',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove as tabelas e colunas criadas
    await queryInterface.dropTable('MovieKeyword');
    await queryInterface.dropTable('MovieNetwork');
    await queryInterface.dropTable('MovieDirector');
    await queryInterface.dropTable('MovieCast');
    await queryInterface.dropTable('MovieGenre');
    await queryInterface.dropTable('Keywords');
    await queryInterface.dropTable('Networks');
    await queryInterface.dropTable('Directors');
    await queryInterface.dropTable('Casts');
    await queryInterface.dropTable('Genres');

    // Remove a coluna trailer_url da tabela Movies
    await queryInterface.removeColumn('Movies', 'trailer_url');
  }
};
