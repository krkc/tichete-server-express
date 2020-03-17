import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';

import { AuthStrategy } from 'app/base/auth-strategy';
import Database from 'db/database';
import { Op } from 'sequelize';
import User from '../../../models/user';

class LocalAuthStrategy implements AuthStrategy {
    public Register = (database: Database, passport: PassportStatic) => {
        const userRepo = database.sequelize.getRepository(User);
        passport.use(
            new Strategy((username: string, password: string, done: (err: any, user?: any, msg?: any) => void) => {
                userRepo
                    .findOne({
                        where: {
                            [Op.or]: [{ username }, { email: username }],
                        },
                    })
                    .then((user: User) => {
                        if (!user) {
                            return done(null, false);
                        }

                        user.checkPassword(password).then((matches) => {
                            if (matches) {
                                done(null, user);
                            } else {
                                done(null, false);
                            }
                        });
                    })
                    .catch((err: string) => {
                        return done(err);
                    });
            }),
        );
        return passport;
    };
}

export default new LocalAuthStrategy();
