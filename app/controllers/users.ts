import { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { Op, FindOptions } from 'sequelize';
import { Repository } from 'sequelize-typescript';

import { AppServer } from 'app/base/app-server';
import { Controller } from './controller';

import { User } from '../models/user';

export class UsersController extends Controller {
    private usersRepo: Repository<User>;

    constructor(appServer: AppServer) {
        super(appServer);
        this.usersRepo = appServer.Database.sequelize.getRepository(User);

        this.AddValidations(['Create'], [
            check('username', 'Please provide a username.').isString(),
            check('email', 'Please provide a valid email.').isEmail(),
            check('password', 'Please provide a password.').isString(),
        ]);
        // this.AddAuthentication([
        //     "Index", "Show", "Create", "Update", "Delete", "Search"
        // ], [ authenticator.authenticate('jwt') ]);
    }

    public Index = (req: Request, res: Response, next: NextFunction): void => {
        this.usersRepo.findAll()
            .then((users: User[]) => {
                res.json(users);
            }).catch((err: any) => {
                throw new Error(err);
            });
    };

    public Show = (req: Request, res: Response, next: NextFunction): void => {
        this.usersRepo.findByPk(req.params.userId)
            .then((user: User) => {
                res.json(user);
            }).catch((err: any) => {
                throw new Error(err);
            });
    };

    public Create = (req: Request, res: Response, next: NextFunction): void => {
        try{UsersController.ValidateRequest(req, res);} catch(e){if (e.errors) return;}
        User.hashPassword(req.body.password)
            .then((hashedPassword: string) => {
                this.usersRepo.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                }).then((user: User) => {
                    res.json(user);
                }).catch((err: any) => {
                    throw new Error(err);
                });
            })
            .catch(err => {
                throw new Error(err);
            });
    };

    public Update = (req: Request, res: Response, next: NextFunction): void => {
        this.usersRepo.findByPk(req.params.userId).then((user: User) => {
            user.username = req.body.username;
            user.email = req.body.email;
            user.save()
                .then(() => res.status(200))
                .catch((err: any) => {
                    throw new Error(err);
                });
        });
    };

    public Delete = (req: Request, res: Response, next: NextFunction): void => {
        this.usersRepo.findByPk(req.params.userId).then((user: User) => {
            user.destroy()
                .then(() => res.status(200))
                .catch((err) => {
                    throw new Error(err);
                });
        });
    };

    public Search = (req: Request, res: Response, next: NextFunction): void => {
        this.usersRepo.findAll({
            limit: 10,
            where: {
                [Op.or]: {
                    firstName: { [Op.like]: `%${req.query.searchTerm}%` },
                    lastName: { [Op.like]: `%${req.query.searchTerm}%` },
                    username: { [Op.like]: `%${req.query.searchTerm}%` }
                }
            }
        } as FindOptions)
        .then(users => {
          res.json(users);
        })
        .catch(err => {
            throw new Error(err)
        });
    };
}
