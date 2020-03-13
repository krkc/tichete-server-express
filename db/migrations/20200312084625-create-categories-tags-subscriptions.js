// npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
// npx sequelize-cli db:migrate

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'TicketCategories',
                {
                    id: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                    },
                    name: {
                        type: new Sequelize.DataTypes.STRING(128),
                        allowNull: true,
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DataTypes.DATE,
                    },
                    updatedAt: {
                        allowNull: false,
                        type: Sequelize.DataTypes.DATE,
                    },
                },
                { transaction },
            );
            await queryInterface.createTable(
                'Tags',
                {
                    id: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                    },
                    ticketId: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        references: {
                            model: {
                                tableName: 'Tickets',
                            },
                            key: 'id',
                        },
                        allowNull: false,
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    },
                    categoryId: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        references: {
                            model: {
                                tableName: 'TicketCategories',
                            },
                            key: 'id',
                        },
                        allowNull: false,
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DataTypes.DATE,
                    },
                    updatedAt: {
                        allowNull: false,
                        type: Sequelize.DataTypes.DATE,
                    },
                },
                { transaction },
            );
            await queryInterface.createTable(
                'Subscriptions',
                {
                    id: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                    },
                    userId: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        references: {
                            model: {
                                tableName: 'Users',
                            },
                            key: 'id',
                        },
                        allowNull: false,
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    },
                    categoryId: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        references: {
                            model: {
                                tableName: 'TicketCategories',
                            },
                            key: 'id',
                        },
                        allowNull: false,
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DataTypes.DATE,
                    },
                    updatedAt: {
                        allowNull: false,
                        type: Sequelize.DataTypes.DATE,
                    },
                },
                { transaction },
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
    down: async queryInterface => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.dropTable('Subscriptions', { transaction });
            await queryInterface.dropTable('Tags', { transaction });
            await queryInterface.dropTable('TicketCategories', { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
