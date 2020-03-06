import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { check, CustomValidator, Meta } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import { AppServer } from 'app/base/app-server';
import { Controller } from './controller';

import { User } from '../models/user';

export class AuthController extends Controller {
    private usersRepo: Repository<User>;

    constructor(appServer: AppServer) {
        super(appServer);
        this.usersRepo = appServer.Database.sequelize.getRepository(User);

        const passwordLength = 4;
        this.AddValidations(['Register'], [
            check('username', 'Please provide a username.').isString(),
            check('email', 'Please provide a valid email.').isEmail(),
            check('password', `Password must be at least ${passwordLength} characters long.`).isLength({ min: passwordLength }),
            check('confirmPassword')
                .custom(this.PasswordValidator),
        ]);
        this.AddValidations(['Login'], [
            check('username', 'Please enter your username.').isString(),
            check('password', 'Please enter your password.').isString(),
        ]);
        this.AddAuthentication([
            'Login'
        ], [appServer.Authenticator.authenticate('local')]);
        this.AddAuthentication([
            'Request', 'Reset'
        ], [appServer.Authenticator.authenticate('jwt')]);
    }

    public Register = (req: Request, res: Response, next: NextFunction): void => {
        try{AuthController.ValidateRequest(req, res);} catch(e){if (e.errors) return;}
        User.hashPassword(req.body.password)
            .then((hashedPassword: string) => {
                this.usersRepo.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                }).then((user: User) => {
                    res.json(jwt.sign({
                        uid: user.id,
                        scope: 'admin'
                    },
                        this.appServer.Config.auth.secret,
                        this.appServer.Config.auth.jwtSignOptions as SignOptions));
                }).catch((err: any) => {
                    throw new Error(err);
                });
            })
            .catch(err => {
                throw new Error(err);
            });
    };

    public Login = (req: Request, res: Response, next: NextFunction): void => {
        throw new Error('Not implemented');
    };

    public Request = (req: Request, res: Response, next: NextFunction): void => {
        throw new Error('Not implemented');
    };

    public Reset = (req: Request, res: Response, next: NextFunction): void => {
        throw new Error('Not implemented');
    };

    private PasswordValidator = (value: any, { req, location, path }: Meta): CustomValidator => {
        if (value !== req.body.password) {
            throw new Error('The passwords you entered don\'t match.');
        } else {
            return value;
        }
    }
}
