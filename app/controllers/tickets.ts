/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';
import { WhereOptions, Includeable } from 'sequelize/types';
import { Resource } from 'hal';

import Database from 'db/database';
import Controller from './controller';

import Ticket from '../models/ticket';
import TicketCategory from '../models/ticket-category';
import Tag from '../models/tag';
import User from '../models/user';

import passport = require('passport');

export default class TicketsController extends Controller {
    private ticketsRepo: Repository<Ticket>;

    private categoriesRepo: Repository<TicketCategory>;

    private categoryTagsRepo: Repository<Tag>;

    private usersRepo: Repository<User>;

    constructor(database: Database, authenticator: passport.Authenticator, configuration: any) {
        super(database, authenticator, configuration);
        this.ticketsRepo = database.sequelize.getRepository(Ticket);
        this.categoriesRepo = database.sequelize.getRepository(TicketCategory);
        this.categoryTagsRepo = database.sequelize.getRepository(Tag);
        this.usersRepo = database.sequelize.getRepository(User);

        this.AddValidations(
            ['Create'],
            [
                check('description', 'Please provide a description.').isString(),
                check('taggedCategoryIds', 'Please tag at least one category.').isArray({ min: 1 }),
            ],
        );
        // this.AddAuthentication(['Index', 'Create', 'Update', 'Delete'], [authenticator.authenticate('jwt')]);
    }

    public Index = (req: Request, res: Response): void => {
        const whereOptions: WhereOptions = {};
        if (req.query.creatorId) {
            whereOptions.creatorId = req.query.creatorId;
        }

        const includeOptions: Includeable[] = [];
        if (req.query.subscriberId) {
            includeOptions.push({
                as: 'subscribedUsers',
                model: this.usersRepo,
                through: {
                    where: { userId: req.query.subscriberId },
                },
            });
        }

        this.ticketsRepo
            .findAll({
                where: whereOptions,
                include: [
                    {
                        as: 'taggedCategories',
                        model: this.categoriesRepo,
                        include: includeOptions,
                    },
                ],
            })
            .then((tickets: Ticket[]) => {
                const ticketsResource = new Resource({}, '/tickets');
                const ticketsToAdd: Resource[] = [];
                tickets.forEach(ticket => {
                    const ticketResource = new Resource({}, `/tickets/${ticket.id}`);
                    ticketsToAdd.push(ticketResource);
                });

                ticketsResource.embed(`ticket`, ticketsToAdd);
                res.json(ticketsResource);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Show = (req: Request, res: Response): void => {
        this.ticketsRepo
            .findByPk(req.params.ticketId, { include: ['taggedCategories'] })
            .then((ticket: Ticket) => {
                const ticketResource = new Resource(ticket.toJSON(), `/tickets/${ticket.id}`);
                ticketResource.link(`taggedCategories`, `/tickets/${ticket.id}/taggedCategories`);
                ticketResource.link(`assignedUsers`, `/tickets/${ticket.id}/assignedUsers`);

                const categoriesToAdd: Resource[] = [];
                ticket.taggedCategories.forEach(category => {
                    const categoryResource = new Resource({}, `/tickets/${ticket.id}/taggedCategories/${category.id}`);
                    categoriesToAdd.push(categoryResource);
                });
                ticketResource.embed(`/tickets/${ticket.id}/taggedCategories`, categoriesToAdd);
                res.json(ticketResource);
            })
            .catch((err: any) => {
                throw new Error(err);
            });
    };

    public Create = async (req: Request, res: Response): Promise<Ticket> => {
        try {
            TicketsController.ValidateRequest(req);
        } catch (err) {
            res.status(422).json(err);
            return;
        }
        const newTicket = await this.ticketsRepo.create({
            description: req.body.description,
        });
        const categoryObjects = req.body.taggedCategoryIds.map((categoryId: number) => {
            return {
                ticketId: newTicket.id,
                categoryId,
            };
        });
        this.categoryTagsRepo.bulkCreate(categoryObjects);
        res.json(newTicket);
    };

    public Update = (req: Request, res: Response): void => {
        try {
            TicketsController.ValidateRequest(req);
        } catch (err) {
            res.status(422).json(err);
            return;
        }
        this.ticketsRepo.findByPk(req.params.ticketId).then((ticket: Ticket) => {
            ticket.name = '';
            ticket
                .save()
                .then(() => res.status(200))
                .catch((err: any) => {
                    throw new Error(err);
                });
        });
    };

    public Delete = (req: Request, res: Response): void => {
        this.ticketsRepo.findByPk(req.params.ticketId).then((ticket: Ticket) => {
            ticket
                .destroy()
                .then(() => res.status(200).send())
                .catch((err: string) => {
                    throw new Error(err);
                });
        });
    };
}
