import { PassportStatic } from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

import { User } from "../../../models/user";

export function Register(passport: PassportStatic) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.APP_JWT_SECRET,
        issuer: 'accounts.examplesoft.com',
        audience: 'yoursite.net',
    }

    passport.use(new Strategy(opts,
        (jwtPayload: any, done: (err: any, user: any) => void) => {
            User.findOne({ where: { id: jwtPayload.sub } })
                .then((user: User) => {
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                        // or you could create a new account
                    }
                })
                .catch((err: string) => {
                    throw new Error(err);
                });
        })
    );
    return passport;
}
