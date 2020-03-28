/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Op, FindOptions } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import passport = require('passport');
import { Resource } from 'hal';

import Database from 'db/database';
import Controller from './controller';

import User from '../models/user';
import Ticket from '../models/ticket';

export default class UsersController extends Controller {
    private usersRepo: Repository<User>;
    private ticketsRepo: Repository<Ticket>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.usersRepo = database.sequelize.getRepository(User);
        this.ticketsRepo = database.sequelize.getRepository(Ticket);

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

    public Index = async (req: Request, res: Response): Promise<void> => {
        const findOptions: FindOptions = {};
        if (req.query.assignedTicket) {
            findOptions.include = [{
                as: 'assignedTickets',
                model: this.ticketsRepo,
                where: { id: req.query.assignedTicket }
            }];
        }
        const users = await this.usersRepo.findAll(findOptions);

        const usersResource = new Resource({}, '/users');
        const usersToAdd: Resource[] = [];
        users.forEach(user => {
            const userResource = new Resource({}, `/users/${user.id}`);
            usersToAdd.push(userResource);
        });
        usersResource.embed(`user`, usersToAdd);

        res.json(usersResource);
    };

    public Show = async (req: Request, res: Response): Promise<void> => {
        const user: User = await this.usersRepo.findByPk(req.params.userId);

        const userResource = new Resource(user.toJSON(), `/users/${user.id}`);
        userResource.link('submittedTickets', `/tickets?creatorId=${user.id}`);
        userResource.link(`assignedTickets`, `/tickets?assignedUser=${user.id}`);
        userResource.link('subscribedCategories', `/users/${user.id}/subscribed-categories`);
        userResource.link('subscribedTickets', `/tickets?subscriberId=${user.id}`);
        res.json(userResource);
    };

    public Create = async (req: Request, res: Response): Promise<void> => {
        UsersController.ValidateRequest(req);

        const hashedPassword = await User.hashPassword(req.body.password);
        const user = await this.usersRepo.create({
            email: req.body.email,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword,
        });
        res.json(user);
    };

    public Update = async (req: Request, res: Response): Promise<void> => {
        UsersController.ValidateRequest(req);

        let user = await this.usersRepo.findByPk(req.params.userId);
        user.username = req.body.username ?? user.username;
        user.email = req.body.email ?? user.email;
        user.firstName = req.body.firstName ?? user.firstName;
        user.lastName = req.body.lastName ?? user.lastName;
        user.password = req.body.password ?? user.password;
        user = await user.save();
        res.json(user);
    };

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const user = await this.usersRepo.findByPk(req.params.userId);
        await user.destroy();
        res.status(200).send();
    };

    public Search = async (req: Request, res: Response): Promise<void> => {
        UsersController.ValidateRequest(req);

        const users = await this.usersRepo.findAll({
            limit: 10,
            where: {
                [Op.or]: {
                    firstName: { [Op.like]: `%${req.query.searchTerm}%` },
                    lastName: { [Op.like]: `%${req.query.searchTerm}%` },
                    username: { [Op.like]: `%${req.query.searchTerm}%` },
                },
            },
        } as FindOptions);
        res.json(users);
    };
}
