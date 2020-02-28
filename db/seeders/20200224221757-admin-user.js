// npx sequelize-cli db:seed:all

const bcrypt = require("bcrypt");

("use strict");

module.exports = {
    up: (queryInterface, Sequelize) => {
        const newUser = {
        firstName: "Site",
        lastName: "Admin",
        username: "admin",
        email: "admin@site.com",
        password: "",
        createdAt: new Date(),
        updatedAt: new Date()
        };

        const saltRounds = process.env.DB_PASSWORD_SALT_ROUNDS;
        const myPlaintextPassword = "password";
        const hashedPassword = bcrypt.hashSync(myPlaintextPassword, +saltRounds)
        newUser.password = hashedPassword;

        return queryInterface.bulkInsert("Users", [newUser], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Users", null, {});
    }
};
