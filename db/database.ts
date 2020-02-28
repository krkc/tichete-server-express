import { Sequelize, Options } from "sequelize";
import * as path from "path";
const walker = require("walker");

import configFile from "./config/config.json";
import { Schema } from "./schemas/schema";

export class Database {
    public readonly sequelize: Sequelize;
    private static instance: Database;
    private config: Options;

    private constructor() {
        const env = process.env.APP_ENV || 'development';
        this.config = (configFile as any)[env];
        this.sequelize = new Sequelize(
            this.config.database,
            this.config.username,
            this.config.password,
            this.config);

        this.TestConnection();
        this.RegisterModelsAndAssociations();
    }

    public static GetInstance() {
        if (!this.instance) {
            this.instance = new Database();
        }

        return this.instance;
    }

    private TestConnection() {
        this.sequelize.authenticate()
            .catch((err) => {
                throw new Error(`Unable to connect to the database: ${err}`);
            });
    }

    private RegisterModelsAndAssociations() {
        const schemasPath = path.join(__dirname, './schemas');
        const schemas: Schema[] = [];

        walker(schemasPath)
            .on('file', (file: any) => {
                if (!file.match(/(?<!schema)(?:\.js)$/m)) return;

                const schemaModule = require(file).default;
                const schema: Schema = new schemaModule(this.sequelize);
                schema.RegisterModel();
                schemas.push(schema);
            })
            .on('error', (er: any, entry: any) => {
                throw new Error(`Got error ${er} on entry ${entry}`);
            }).on('end', () => {
                schemas.forEach((schemaModule) => {
                    schemaModule.RegisterAssociations();
                });
            });
    }
}
