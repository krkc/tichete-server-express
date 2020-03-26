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
                check('ticketCategoryIds', 'Please tag at least one category id.').isArray({ min: 1 }),
            ],
        );
        // this.AddAuthentication(['Index', 'Create', 'Update', 'Delete'], [authenticator.authenticate('jwt')]);
    }

    public Index = async (req: Request, res: Response): Promise<void> => {
        // TODO: Handle query param '/tickets?categoryIds=1,3,6'
        // TODO: All these different query options will bloat this controller. Need solution.
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

        const tickets = await this.ticketsRepo.findAll({
            where: whereOptions,
            include: [
                {
                    as: 'taggedCategories',
                    model: this.categoriesRepo,
                    include: includeOptions,
                },
            ],
        });

        const ticketsResource = new Resource({}, '/tickets');
        const ticketsToAdd: Resource[] = [];
        tickets.forEach(ticket => {
            const ticketResource = new Resource({}, `/tickets/${ticket.id}`);
            ticketsToAdd.push(ticketResource);
        });
        ticketsResource.embed(`ticket`, ticketsToAdd);

        res.json(ticketsResource);
    };

    public Show = async (req: Request, res: Response): Promise<void> => {
        const ticket = await this.ticketsRepo.findByPk(req.params.ticketId, { include: ['taggedCategories'] });

        const ticketUrl = `/tickets/${ticket.id}`;
        const taggedCategoriesUrl = `${ticketUrl}/tagged-categories`;
        const ticketResource = new Resource(ticket.toJSON(), ticketUrl);
        ticketResource.link(`taggedCategories`, taggedCategoriesUrl);
        ticketResource.link(`assignedUsers`, `/users?assignedTicket=${ticket.id}`);

        const categoriesToAdd: Resource[] = [];
        ticket.taggedCategories.forEach(category => {
            const categoryResource = new Resource({}, `${taggedCategoriesUrl}/${category.id}`);
            categoriesToAdd.push(categoryResource);
        });
        ticketResource.embed(taggedCategoriesUrl, categoriesToAdd);

        res.json(ticketResource);
    };

    public Create = async (req: Request, res: Response): Promise<void> => {
        TicketsController.ValidateRequest(req);

        const newTicket = await this.ticketsRepo.create({
            description: req.body.description,
        });
        const categoryObjects = req.body.ticketCategoryIds.map((ticketCategoryId: number) => {
            return {
                ticketId: newTicket.id,
                categoryId: ticketCategoryId,
            };
        });
        this.categoryTagsRepo.bulkCreate(categoryObjects);
        res.json(newTicket);
    };

    public Update = async (req: Request, res: Response): Promise<void> => {
        TicketsController.ValidateRequest(req);

        const ticket = await this.ticketsRepo.findByPk(req.params.ticketId);
        if (req.body.name) ticket.name = req.body.name;
        if (req.body.description) ticket.description = req.body.description;
        await ticket.save();

        res.status(200).send();
    };

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const ticket = await this.ticketsRepo.findByPk(req.params.ticketId);
        ticket.destroy();
        res.status(200).send();
    };
}
