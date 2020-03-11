import { PassportStatic } from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { AuthStrategy } from 'app/base/auth-strategy';
import Database from 'db/database';
import User from '../../../models/user';

class JwtAuthStrategy implements AuthStrategy {
    public Register = (database: Database, passport: PassportStatic) => {
        const userRepo = database.sequelize.getRepository(User);
        const opts = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.APP_JWT_SECRET,
            issuer: 'accounts.examplesoft.com',
            audience: 'yoursite.net',
        };

        passport.use(
            new Strategy(opts, (jwtPayload: any, done: (err: any, user: any) => void) => {
                userRepo
                    .findOne({ where: { id: jwtPayload.sub } })
                    .then((user: User) => {
                        if (user) {
                            return done(null, user);
                        }
                        return done(null, false);
                        // or you could create a new account
                    })
                    .catch((err: string) => {
                        throw new Error(err);
                    });
            }),
        );
        return passport;
    };
}

export default new JwtAuthStrategy();
