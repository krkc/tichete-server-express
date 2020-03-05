// npx sequelize-cli db:seed:all

const bcrypt = require("bcrypt");

("use strict");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();

        const roles = [ // Ordered by level of permission
            {
                id: 1,
                name: "Admin", // Site admin
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                name: "Manager",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                name: "Level Three Specialist",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 4,
                name: "Level Two Specialist",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 5,
                name: "Level One Specialist",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 6,
                name: "Level One Analyst",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 7,
                name: "User",
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ];

        const newUser = {
            firstName: "Site",
            lastName: "Admin",
            username: "admin",
            email: "admin@site.com",
            password: "",
            roleId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const saltRounds = process.env.DB_PASSWORD_SALT_ROUNDS;
        const myPlaintextPassword = "password";
        const hashedPassword = await bcrypt.hash(
            myPlaintextPassword,
            +saltRounds
        );
        newUser.password = hashedPassword;

        try {
            await queryInterface.bulkInsert("Roles", roles, {
                transaction
            });
            await queryInterface.bulkInsert("Users", [newUser], {
                transaction
            });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    down: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.bulkDelete("Roles", null, { transaction });
            await queryInterface.bulkDelete("Users", null, { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
};
