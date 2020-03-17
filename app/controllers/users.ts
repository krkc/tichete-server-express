/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Op, FindOptions } from 'sequelize';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';
import { Resource } from 'hal';
import Controller from './controller';

import User from '../models/user';

import passport = require('passport');

export default class UsersController extends Controller {
    private usersRepo: Repository<User>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.usersRepo = database.sequelize.getRepository(User);

        this.AddValidations(
            ['Create'],
            [
                check('username', 'Please provide a username.').isString(),
                check('email', 'Please provide a valid email.').isEmail(),
                check('password', 'Please provide a password.').isString(),
            ],
        );
        // this.AddAuthentication(
        //     ['Index', 'Show', 'Create', 'Update', 'Delete', 'Search'],
        //     [authenticator.authenticate('jwt')],
        // );
    }

    public Index = (req: Request, res: Response): void => {
        this.usersRepo
            .findAll()
            .then((users: User[]) => {
                res.json(users);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Show = async (req: Request, res: Response): Promise<void> => {
        const user: User = await this.usersRepo.findByPk(req.params.userId);

        const userResource = new Resource(user.toJSON(), 'user');
        userResource.link('submittedTickets', `/tickets?creatorId=${user.id}`);
        userResource.link('assignedTickets', `/users/${user.id}/assigned-tickets`);
        userResource.link('subscribedCategories', `/users/${user.id}/subscribed-categories`);
        userResource.link('subscribedTickets', `/tickets?subscriberId=${user.id}`);
        res.json(userResource);
    };

    public Create = (req: Request, res: Response): void => {
        try {
            UsersController.ValidateRequest(req, res);
        } catch (e) {
            if (e.errors) return;
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
                        res.json(user);
                    })
                    .catch((err: any) => {
                        throw new Error(err);
                    });
            })
            .catch((err: string) => {
                throw new Error(err);
            });
    };

    public Update = (req: Request, res: Response): void => {
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

    public Delete = (req: Request, res: Response): void => {
        this.usersRepo.findByPk(req.params.userId).then((user: User) => {
            user.destroy()
                .then(() => res.status(200))
                .catch((err: string) => {
                    throw new Error(err);
                });
        });
    };

    public Search = (req: Request, res: Response): void => {
        this.usersRepo
            .findAll({
                limit: 10,
                where: {
                    [Op.or]: {
                        firstName: { [Op.like]: `%${req.query.searchTerm}%` },
                        lastName: { [Op.like]: `%${req.query.searchTerm}%` },
                        username: { [Op.like]: `%${req.query.searchTerm}%` },
                    },
                },
            } as FindOptions)
            .then(users => {
                res.json(users);
            })
            .catch(err => {
                throw new Error(err);
            });
    };
}
