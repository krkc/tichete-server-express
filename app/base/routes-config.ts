import { Application } from "express";
import passport from "passport";

import { Database } from "db/database";

export interface RoutesConfig {
    Register(app: Application, db: Database, authenticator: passport.Authenticator): void;
}
