const TicketSchema = require("../../dist/db/schemas/tickets").default;

'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const ticketSchema = new TicketSchema(Sequelize);
    return queryInterface.createTable(
        ticketSchema.TableName,
        ticketSchema.SchemaInfo
    );
  },
  down: (queryInterface, Sequelize) => {
    const ticketSchema = new TicketSchema(Sequelize);
    return queryInterface.dropTable(ticketSchema.TableName);
  }
};
