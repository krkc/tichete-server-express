import passport from "passport";
import { Application } from "express";
const walker = require("walker");

import { AuthLoader } from "../base/auth/strategies";

export interface Routes {
    Register(app: Application, authenticator: passport.Authenticator): void;
}

export class RoutesLoader {
    public static RegisterRoutesAndAuth(app: Application): passport.Authenticator {
        const authenticator: passport.Authenticator = AuthLoader.ConfigureAuth();

        const routepath = __dirname;

        walker(routepath)
            .on('file', (file: any) => {
                if (!file.match(/(?<!index)(?:\.js)$/m)) return;

                const routes: Routes = require(file).default;
                routes.Register(app, authenticator);
            })
            .on('error', (er: any, entry: any) => {
                throw new Error(`Got error ${er} on entry ${entry}`);
            });

        return authenticator;
    }
}
