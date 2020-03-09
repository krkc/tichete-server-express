import express, { Application } from 'express';
import passport, { Passport } from 'passport';

import Database from 'db/database';
import { AuthStrategy } from './auth-strategy';
import { RoutesConfig } from './routes-config';
import authStrategies from './auth/strategies';
import routesConfigs from '../routes';
import serverConfig from '../../config/server.config';

export default class AppServer {
    private static instance: AppServer;

    public readonly Config = serverConfig;

    constructor(
        private readonly database: Database,
        private readonly expressApp: Application,
        private readonly authenticator: passport.Authenticator,
    ) {}

    public static async GetInstance(db: Database) {
        if (!this.instance) {
            const auth = await this.GetConfiguredAuth();
            const expressApp: Application = express();
            this.instance = new AppServer(db, expressApp, auth);
        }

        return this.instance;
    }

    public get Database(): Database {
        return this.database;
    }

    public get ExpressApp(): Application {
        return this.expressApp;
    }

    public get Authenticator(): passport.Authenticator {
        return this.authenticator;
    }

    private static GetConfiguredAuth = async (): Promise<passport.Authenticator> => {
        const authenticator = new Passport();
        authenticator.serializeUser((user, done) => {
            done(null, user);
        });

        authenticator.deserializeUser((user, done) => {
            done(null, user);
        });

        (await authStrategies).forEach((strategy: AuthStrategy) => {
            strategy.Register(authenticator);
        });

        return authenticator;
    };

    public RegisterRoutesAndAuth = async (): Promise<passport.Authenticator> => {
        (await routesConfigs).forEach((routesConfig: RoutesConfig) => {
            routesConfig.Register(this.expressApp, this.database, this.authenticator, this.Config);
        });

        return this.Authenticator;
    };
}
