import { Sequelize } from "sequelize";

export abstract class Schema {
    public TableName: string;
    public SchemaInfo: {};

    constructor(protected sequelize: Sequelize) { }

    public abstract RegisterModel(): void;
    public abstract RegisterAssociations(): void;
}