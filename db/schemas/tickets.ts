import { Sequelize, DataTypes } from 'sequelize';

import { Schema } from "./schema";
import { Ticket } from "../../app/models/ticket";

export default class TicketsSchema extends Schema {
    constructor(sequelize: Sequelize) {
        super(sequelize);

        this.TableName = 'Tickets';
        this.SchemaInfo = {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: new DataTypes.STRING(128),
                allowNull: true,
            },
            description: {
                type: new DataTypes.STRING(128),
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: new DataTypes.DATE(),
            },
            updatedAt: {
                allowNull: false,
                type: new DataTypes.DATE(),
            }
        };
    }

    public RegisterModel(): any {
        if (this.sequelize.models.Ticket) return this.sequelize.models.Ticket;

        Ticket.init(this.SchemaInfo, {
            tableName: this.TableName,
            sequelize: this.sequelize,
        });

        return this.sequelize.models.Ticket;
    }

    public RegisterAssociations(): void { return; }
}
