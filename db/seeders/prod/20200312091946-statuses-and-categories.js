// npx sequelize-cli db:seed:all

module.exports = {
    up: async queryInterface => {
        const transaction = await queryInterface.sequelize.transaction();

        const statuses = [
            {
                id: 1,
                name: 'Pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                name: 'In Progress',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 3,
                name: 'Closed',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        try {
            await queryInterface.bulkInsert('TicketStatuses', statuses, {
                transaction,
            });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    down: async queryInterface => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkDelete('TicketStatuses', null, { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
