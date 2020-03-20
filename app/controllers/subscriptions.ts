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

    private ticketCategoriesRepo: Repository<TicketCategory>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.subscriptionsRepo = database.sequelize.getRepository(Subscription);
        this.usersRepo = database.sequelize.getRepository(User);
        this.ticketCategoriesRepo = database.sequelize.getRepository(TicketCategory);

        this.AddValidations(
            ['Create'],
            [
                check('userId', 'Please provide a user id.').isInt(),
                check('categoryId', 'Please provide a category id.').isInt(),
            ],
        );
        // this.AddAuthentication(['Index', 'Create', 'Delete'], [authenticator.authenticate('jwt')]);
    }

    public Index = async (req: Request, res: Response): Promise<void> => {
        if (req.params.userId) {
            const user = await this.usersRepo.findByPk(req.params.userId, { include: [this.ticketCategoriesRepo] });
            res.json(user?.subscriptions);
        } else if (req.params.categoryId) {
            const ticketCategory = await this.ticketCategoriesRepo.findByPk(req.params.categoryId, {
                include: [this.usersRepo],
            });
            res.json(ticketCategory?.subscribedUsers);
        }
    };

    public Create = async (req: Request, res: Response): Promise<void> => {
        SubscriptionsController.ValidateRequest(req);

        const subscription = await this.subscriptionsRepo.create({
            userId: req.params.userId,
            categoryId: req.params.categoryId,
        });
        res.json(subscription);
    };

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const subscription = await this.subscriptionsRepo.findByPk(req.params.subscriptionId);
        await subscription.destroy();
        res.status(200).send();
    };
}
