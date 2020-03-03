// npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
// npx sequelize-cli db:migrate

const UserSchema = require("../../dist/db/schemas/users").default;

("use strict");
module.exports = {
    up: (queryInterface, Sequelize) => {
        const userSchema = new UserSchema(Sequelize);
        return queryInterface.createTable(
            userSchema.TableName,
            userSchema.SchemaInfo
        );
    },
    down: (queryInterface, Sequelize) => {
        const userSchema = new UserSchema(Sequelize);
        return queryInterface.dropTable(userSchema.TableName);
    }
};
