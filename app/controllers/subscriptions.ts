import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';
import passport from 'passport';
import Controller from './controller';

import Subscription from '../models/subscription';
import User from '../models/user';
import TicketCategory from '../models/ticket-category';

export default class SubscriptionsController extends Controller {
    private subscriptionsRepo: Repository<Subscription>;

    private usersRepo: Repository<User>;

    private categoriesRepo: Repository<TicketCategory>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.subscriptionsRepo = database.sequelize.getRepository(Subscription);
        this.usersRepo = database.sequelize.getRepository(User);
        this.categoriesRepo = database.sequelize.getRepository(TicketCategory);

        this.AddValidations(
            ['Create'],
            [
                check('userId', 'Please provide a user id.').isInt(),
                check('categoryId', 'Please provide a category id.').isInt(),
            ],
        );
        // this.AddAuthentication(['Index', 'Create', 'Delete'], [authenticator.authenticate('jwt')]);
    }

    public Index = (req: Request, res: Response): void => {
        let promise: Promise<void>;

        if (req.params.userId) {
            promise = this.usersRepo
                .findByPk(req.params.userId, { include: [this.categoriesRepo] })
                .then((user: User) => {
                    res.json(user?.subscriptions);
                });
        } else if (req.params.categoryId) {
            promise = this.categoriesRepo
                .findByPk(req.params.categoryId, { include: [this.usersRepo] })
                .then((ticket: TicketCategory) => {
                    res.json(ticket?.subscribedUsers);
                });
        }

        promise.catch((err: any) => {
            throw new Error(err);
        });
    };

    public Create = (req: Request, res: Response): void => {
        try {
            SubscriptionsController.ValidateRequest(req, res);
        } catch (e) {
            if (e.errors) return;
        }

        this.subscriptionsRepo
            .create({
                userId: req.params.userId,
                categoryId: req.params.categoryId,
            })
            .then((subscription: Subscription) => {
                res.json(subscription);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Delete = (req: Request, res: Response): void => {
        this.subscriptionsRepo.findByPk(req.params.subscriptionId).then((subscription: Subscription) => {
            subscription
                .destroy()
                .then(() => res.status(200))
                .catch((err: string) => {
                    throw new Error(err);
                });
        });
    };
}
