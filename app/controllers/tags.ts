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

    public Index = (req: Request, res: Response): void => {
        let promise: Promise<void>;

        if (req.params.ticketId) {
            promise = this.ticketsRepo
                .findByPk(req.params.ticketId, { include: [this.ticketCategoriesRepo] })
                .then((ticket: Ticket) => {
                    res.json(ticket?.taggedCategories);
                });
        } else if (req.params.categoryId) {
            promise = this.ticketCategoriesRepo
                .findByPk(req.params.categoryId, { include: [this.ticketsRepo] })
                .then((ticketCategory: TicketCategory) => {
                    res.json(ticketCategory?.taggedTickets);
                });
        }

        promise.catch((err: any) => {
            throw new Error(err);
        });
    };

    public Create = (req: Request, res: Response): void => {
        try {
            TagsController.ValidateRequest(req, res);
        } catch (e) {
            if (e.errors) return;
        }

        this.tagsRepo
            .create({
                ticketId: req.params.ticketId,
                categoryId: req.params.categoryId,
            })
            .then((tag: Tag) => {
                res.json(tag);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Delete = (req: Request, res: Response): void => {
        this.tagsRepo.findByPk(req.params.tagId).then((tag: Tag) => {
            tag.destroy()
                .then(() => res.status(200))
                .catch((err: string) => {
                    throw new Error(err);
                });
        });
    };
}
