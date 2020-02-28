import { Database } from "db/database";
import passport, { Passport } from "passport";

const walker = require("walker");

export class AuthLoader {
    public static ConfigureAuth() {
        const authenticator = new Passport();
        authenticator.serializeUser((user, done) => {
            done(null, user);
        });

        authenticator.deserializeUser((user, done) => {
            done(null, user);
        });

        this.RegisterAuthStrategies(authenticator);

        return authenticator;
    }

    private static RegisterAuthStrategies(authenticator: passport.Authenticator) {
        const routepath = __dirname;

        walker(routepath)
            .on('file', (file: any) => {
                if (!file.match(/(?<!index)(?:\.js)$/m)) return;

                require(file).Register(authenticator);
            })
            .on('error', (er: any, entry: any) => {
                throw new Error(`Got error ${er} on entry ${entry}`);
            });
    }
}
