import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';

import { AuthStrategy } from 'app/base/auth-strategy';
import User from '../../../models/user';

class LocalAuthStrategy implements AuthStrategy {
    public Register = (passport: PassportStatic) => {
        passport.use(
            new Strategy((username: string, password: string, done: (err: any, user?: any, msg?: any) => void) => {
                User.findOne({ where: { username } })
                    .then((user: User) => {
                        if (!user) {
                            return done(null, false, { message: 'Incorrect username.' });
                        }
                        if (!user.checkPassword(password)) {
                            return done(null, false, { message: 'Incorrect password.' });
                        }
                        return done(null, user);
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
