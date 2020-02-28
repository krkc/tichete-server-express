// npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
// npx sequelize-cli db:migrate

const userSchema = require("../../dist/db/schemas/users");

("use strict");
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            userSchema.tableName,
            userSchema.schema
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(userSchema.tableName);
    }
};
