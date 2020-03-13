// npx sequelize-cli db:seed:all
const faker = require('faker');

module.exports = {
    up: async queryInterface => {
        const transaction = await queryInterface.sequelize.transaction();

        const categories = [
            {
                id: 1,
                name: 'Software',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                name: 'Hardware',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 3,
                name: 'Network',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        const tickets = [];
        for (let i = 1; i <= 5; i += 1) {
            tickets.push({
                id: i,
                name: faker.name.jobTitle(),
                creatorId: 1,
                statusId: faker.random.number({ min: 1, max: 3 }),
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        const assignments = [];
        for (let i = 1; i <= 5; i += 1) {
            assignments.push({
                id: i,
                userId: 1,
                ticketId: faker.random.number({ min: 1, max: tickets.length }),
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        const tags = [];
        for (let i = 1; i <= 5; i += 1) {
            tags.push({
                id: i,
                ticketId: faker.random.number({ min: 1, max: tickets.length }),
                categoryId: faker.random.number({ min: 1, max: categories.length }),
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        const subscriptions = [];
        for (let i = 1; i <= 5; i += 1) {
            subscriptions.push({
                id: i,
                userId: 1,
                categoryId: faker.random.number({ min: 1, max: categories.length }),
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        try {
            await queryInterface.bulkInsert('TicketCategories', categories, {
                transaction,
            });
            await queryInterface.bulkInsert('Tickets', tickets, {
                transaction,
            });
            await queryInterface.bulkInsert('Assignments', assignments, {
                transaction,
            });
            await queryInterface.bulkInsert('Tags', tags, {
                transaction,
            });
            await queryInterface.bulkInsert('Subscriptions', subscriptions, {
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
            await queryInterface.bulkDelete('Subscriptions', null, { transaction });
            await queryInterface.bulkDelete('Tags', null, { transaction });
            await queryInterface.bulkDelete('Assignments', null, { transaction });
            await queryInterface.bulkDelete('Tickets', null, { transaction });
            await queryInterface.bulkDelete('TicketCategories', null, { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
