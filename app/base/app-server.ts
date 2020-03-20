import express, { Application, Request, Response, NextFunction } from 'express';
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

    private expressApp: Application;

    constructor(private readonly database: Database, private readonly authenticator: passport.Authenticator) {
        this.expressApp = express();
    }

    public static async GetInstance(db: Database) {
        if (!this.instance) {
            const auth = await this.GetConfiguredAuth(db);
            this.instance = new AppServer(db, auth);
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

    private static GetConfiguredAuth = async (database: Database): Promise<passport.Authenticator> => {
        const authenticator = new Passport();
        authenticator.serializeUser((user, done) => {
            done(null, user);
        });

        authenticator.deserializeUser((user, done) => {
            done(null, user);
        });

        (await authStrategies).forEach((strategy: AuthStrategy) => {
            strategy.Register(database, authenticator);
        });

        return authenticator;
    };

    public RegisterRoutesAndAuth = async (): Promise<passport.Authenticator> => {
        (await routesConfigs).forEach((routesConfig: RoutesConfig) => {
            routesConfig.Register(this.expressApp, this.database, this.authenticator, this.Config);
        });

        this.expressApp.use(this.SendErrorsAsJson);

        return this.Authenticator;
    };

    private SendErrorsAsJson = (err: any, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            next(err);
            return;
        }
        const error: any = {
            error: err.name || err,
        };
        if (err.message) {
            error.detail = err.message;
        }
        res.status(err.status || 500);
        if (err.status) {
            res.json(error);
        } else {
            res.send();
            throw err;
        }
    };
}
