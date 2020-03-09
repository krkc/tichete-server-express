module.exports = {
    up: async (queryInterface, Sequelize) =>
        queryInterface.createTable('Assignments', {
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
            createdAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
        }),

    down: async queryInterface => queryInterface.dropTable('Assignments'),
};
