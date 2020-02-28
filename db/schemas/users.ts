import { Sequelize, DataTypes } from 'sequelize';

import { Schema } from "./schema";
import { User } from "../../app/models/user";

export default class UsersSchema extends Schema {
    constructor(sequelize: Sequelize) {
        super(sequelize);

        this.TableName = 'Users';
        this.SchemaInfo = {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: new DataTypes.STRING(128),
                allowNull: true,
            },
            lastName: {
                type: new DataTypes.STRING(128),
                allowNull: true,
            },
            username: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            email: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            password: {
                type: new DataTypes.STRING(128),
                allowNull: false
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
        if (this.sequelize.models.User) return this.sequelize.models.User;

        User.init(this.SchemaInfo, {
            tableName: this.TableName,
            sequelize: this.sequelize,
        });

        return this.sequelize.models.User;
    }

    public RegisterAssociations(): void { return; }
}
