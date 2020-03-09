// npx sequelize-cli model:generate
// npx sequelize-cli db:migrate

module.exports = {
    up: async (queryInterface, Sequelize) =>
        queryInterface.createTable('Users', {
            id: {
                type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: new Sequelize.DataTypes.STRING(128),
                allowNull: true,
            },
            lastName: {
                type: new Sequelize.DataTypes.STRING(128),
                allowNull: true,
            },
            username: {
                type: new Sequelize.DataTypes.STRING(128),
                allowNull: false,
            },
            email: {
                type: new Sequelize.DataTypes.STRING(128),
                allowNull: false,
            },
            password: {
                type: new Sequelize.DataTypes.STRING(128),
                allowNull: false,
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
    down: async queryInterface => queryInterface.dropTable('Users'),
};
