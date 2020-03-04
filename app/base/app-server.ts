import express, { Application } from "express";
import passport, { Passport } from "passport";

import { AuthStrategy } from "./auth-strategy";
import { RoutesConfig } from "./routes-config";
import authStrategies from "./auth/strategies";
import routesConfigs from "../routes";
import { Database } from "db/database";

export class AppServer {
    private static instance: AppServer;

    constructor(
        private readonly expressApp: Application,
        private readonly authenticator: passport.Authenticator
        ) { }

    public static async GetInstance(db: Database) {
        if (!this.instance) {
            const auth = await this.GetConfiguredAuth();
            const expressApp: Application = express();
            await this.RegisterRoutesAndAuth(expressApp, db, auth);
            this.instance = new AppServer(expressApp, auth);
        }

        return this.instance;
    };

    public get ExpressApp() : Application {
        return this.expressApp;
    }

    public get Authenticator() : passport.Authenticator {
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

    private static RegisterRoutesAndAuth = async (app: Application, db: Database, auth: passport.Authenticator): Promise<passport.Authenticator> => {
        (await routesConfigs).forEach((routesConfig: RoutesConfig) => {
            routesConfig.Register(app, db, auth);
        });

        return auth;
    }
}
