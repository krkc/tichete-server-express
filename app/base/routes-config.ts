import Database from 'db/database';
import { Application } from 'express';
import passport from 'passport';

export interface RoutesConfig {
    Register(
        expressApp: Application,
        database: Database,
        authenticator: passport.Authenticator,
        configuration: any,
    ): void;
}
