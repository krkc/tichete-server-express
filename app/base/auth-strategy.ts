import passport from 'passport';

export interface AuthStrategy {
    Register(passport: passport.Authenticator): void;
}
