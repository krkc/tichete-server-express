// npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
// npx sequelize-cli db:migrate

("use strict");
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                "Roles",
                {
                    id: {
                        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true
                    },
                    name: {
                        type: new Sequelize.DataTypes.STRING(128),
                        allowNull: true
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DataTypes.DATE
                    },
                    updatedAt: {
                        allowNull: false,
                        type: Sequelize.DataTypes.DATE
                    }
                },
                { transaction }
            );
            await queryInterface.addColumn(
                "Users",
                "roleId",
                {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    references: {
                        model: {
                            tableName: "Roles"
                        },
                        key: "id"
                    },
                    allowNull: true,
                    onUpdate: "CASCADE",
                    onDelete: "SET NULL"
                },
                { transaction }
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
    down: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.removeColumn("Users", "roleId", {
                transaction
            }),
                await queryInterface.dropTable("Roles", { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
};
