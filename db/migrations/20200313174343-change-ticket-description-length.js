// npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
// npx sequelize-cli db:migrate

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.changeColumn(
                'Tickets',
                'description',
                { type: new Sequelize.DataTypes.STRING(512) },
                { transaction },
            );
            await queryInterface.changeColumn(
                'Tickets',
                'statusId',
                {
                    type: Sequelize.DataTypes.INTEGER.UNSIGNED,
                    defaultValue: 1,
                },
                { transaction },
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    down: () => {},
};
