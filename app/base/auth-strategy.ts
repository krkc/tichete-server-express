import passport from 'passport';
import Database from 'db/database';

export interface AuthStrategy {
    Register(database: Database, passport: passport.Authenticator): void;
}
