module.exports = {
    up: async (queryInterface, Sequelize) =>
        queryInterface.createTable('Tickets', {
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
            description: {
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
        }),
    down: async queryInterface => queryInterface.dropTable('Tickets'),
};
