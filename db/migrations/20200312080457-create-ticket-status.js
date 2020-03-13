// npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
// npx sequelize-cli db:migrate

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'TicketStatuses',
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
            await queryInterface.addColumn(
                'Tickets',
                'statusId',
                {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    references: {
                        model: {
                            tableName: 'TicketStatuses',
                        },
                        key: 'id',
                    },
                    allowNull: true,
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
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
            await queryInterface.removeColumn('Tickets', 'statusId', {
                transaction,
            });
            await queryInterface.dropTable('TicketStatuses', { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
