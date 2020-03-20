import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';

import Database from 'db/database';
import passport from 'passport';
import Controller from './controller';

import Tag from '../models/tag';
import Ticket from '../models/ticket';
import TicketCategory from '../models/ticket-category';

export default class TagsController extends Controller {
    private tagsRepo: Repository<Tag>;

    private ticketsRepo: Repository<Ticket>;

    private ticketCategoriesRepo: Repository<TicketCategory>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.tagsRepo = database.sequelize.getRepository(Tag);
        this.ticketsRepo = database.sequelize.getRepository(Ticket);
        this.ticketCategoriesRepo = database.sequelize.getRepository(TicketCategory);

        this.AddValidations(
            ['Create'],
            [
                check('userId', 'Please provide a user id.').isInt(),
                check('ticketId', 'Please provide a ticket id.').isInt(),
            ],
        );
        // this.AddAuthentication(['Index', 'Create', 'Delete'], [authenticator.authenticate('jwt')]);
    }

    public Index = async (req: Request, res: Response): Promise<void> => {
        if (req.params.ticketId) {
            const ticket = await this.ticketsRepo.findByPk(req.params.ticketId, {
                include: [this.ticketCategoriesRepo],
            });
            res.json(ticket?.taggedCategories);
        } else if (req.params.categoryId) {
            const ticketCategory = await this.ticketCategoriesRepo.findByPk(req.params.categoryId, {
                include: [this.ticketsRepo],
            });
            res.json(ticketCategory?.taggedTickets);
        }
    };

    public Create = async (req: Request, res: Response): Promise<void> => {
        TagsController.ValidateRequest(req);

        const tag = await this.tagsRepo.create({
            ticketId: req.params.ticketId,
            categoryId: req.params.categoryId,
        });
        res.json(tag);
    };

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const tag = await this.tagsRepo.findByPk(req.params.tagId);
        await tag.destroy();
        res.status(200).send();
    };
}
