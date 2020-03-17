import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { check, CustomValidator, Meta } from 'express-validator';
import { Repository } from 'sequelize-typescript';
import passport from 'passport';
import { Resource } from 'hal';

import Database from 'db/database';
import Controller from './controller';
import User from '../models/user';

export default class AuthController extends Controller {
    private usersRepo: Repository<User>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.usersRepo = database.sequelize.getRepository(User);

        const passwordLength = 4;
        this.AddValidations(
            ['Register'],
            [
                check('username', 'Please provide a username.').isString(),
                check('email', 'Please provide a valid email.').isEmail(),
                check('password', `Password must be at least ${passwordLength} characters long.`).isLength({
                    min: passwordLength,
                }),
                check('confirmPassword').custom(this.PasswordValidator),
            ],
        );
        this.AddValidations(
            ['Login'],
            [
                check('username', 'Please enter your username or email.').isString(),
                check('password', 'Please enter your password.').isString(),
            ],
        );
        this.AddAuthentication(['Login'], [this.authenticator.authenticate('local')]);
        this.AddAuthentication(['Request', 'Reset'], [this.authenticator.authenticate('jwt')]);
    }

    public Register = (req: Request, res: Response): void => {
        try {
            AuthController.ValidateRequest(req);
        } catch (err) {
            res.status(422).json(err);
            return;
        }
        User.hashPassword(req.body.password)
            .then((hashedPassword: string) => {
                this.usersRepo
                    .create({
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword,
                    })
                    .then((user: User) => {
                        res.json(
                            jwt.sign(
                                {
                                    uid: user.id,
                                    scope: 'admin',
                                },
                                this.configuration.auth.secret,
                                this.configuration.auth.jwtSignOptions as SignOptions,
                            ),
                        );
                    })
                    .catch((err: any) => {
                        throw new Error(err);
                    });
            })
            .catch(err => {
                throw new Error(err);
            });
    };

    public Login = (req: Request, res: Response): void => {
        try {
            AuthController.ValidateRequest(req);
        } catch (err) {
            res.status(422).json(err);
            return;
        }
        const user = req.user as User;
        const token = jwt.sign(
            {
                uid: user.id,
                scope: 'admin',
            },
            this.configuration.auth.secret,
            this.configuration.auth.jwtSignOptions as SignOptions,
        );
        // const userObj = user.toJSON() as any;
        // userObj.token = token;
        const authenticationResource = new Resource({ token }, '/auth/login');
        authenticationResource.link('authenticatedUser', `/users/${user.id}`);

        res.json(authenticationResource);
    };

    // public Request = (req: Request, res: Response): void => {
    //     throw new Error('Not implemented');
    // };

    // public Reset = (req: Request, res: Response): void => {
    //     throw new Error('Not implemented');
    // };

    private PasswordValidator = (value: any, { req }: Meta): CustomValidator => {
        if (value !== req.body.password) {
            throw new Error("The passwords you entered don't match.");
        } else {
            return value;
        }
    };
}
