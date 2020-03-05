import { Sequelize, SequelizeOptions, Model, ModelCtor } from "sequelize-typescript";

import configFile from "../config/database.json";
import modelsImport from "../app/models";

export class Database {
    public readonly sequelize: Sequelize;
    private static instance: Database;
    private config: SequelizeOptions;

    private constructor(models: string[] | ModelCtor<Model<any, any>>[]) {
        const env = process.env.APP_ENV || 'development';
        this.config = (configFile as any)[env];
        this.config.models = models;
        this.sequelize = new Sequelize(
            this.config.database,
            this.config.username,
            this.config.password,
            this.config);

        this.TestConnection();
    }

    public static async GetInstance() {
        if (!this.instance) {
            this.instance = new Database(await this.GetModels());
        }

        return this.instance;
    }

    private static async GetModels(): Promise<ModelCtor<Model<any, any>>[]> {
        return await modelsImport;
    }

    private TestConnection() {
        this.sequelize.authenticate()
            .catch((err: any) => {
                throw new Error(`Unable to connect to the database: ${err}`);
            });
    }
}
