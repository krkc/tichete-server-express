/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { Repository } from 'sequelize-typescript';
import { WhereOptions, Includeable, FindOptions } from 'sequelize/types';
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
        const subscribedUsersIncludeOptions: Includeable[] = [];
        const findOptions: FindOptions = {
            where: whereOptions,
            include: [
                {
                    as: 'taggedCategories',
                    model: this.categoriesRepo,
                    include: subscribedUsersIncludeOptions,
                },
            ],
        };
        if (req.query.assignedTicket) {
            findOptions.include = [{
                as: 'assignedTickets',
                model: this.ticketsRepo,
                where: { id: req.query.assignedTicket }
            }];
        }
        if (req.query.creatorId) {
            whereOptions.creatorId = req.query.creatorId;
        }
        if (req.query.subscriberId) {
            subscribedUsersIncludeOptions.push({
                as: 'subscribedUsers',
                model: this.usersRepo,
                through: {
                    where: { userId: req.query.subscriberId },
                },
            });
        }

        const tickets = await this.ticketsRepo.findAll(findOptions);

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

        const ticket = this.ticketsRepo.build(req.body, { isNewRecord: false });
        await ticket.save();

        const delta: { creates: any[], destroyIds: number[]} = {
            creates: [] as Tag[],
            destroyIds: [] as number[]
        };
        const categoryTagsMap = (await this.categoryTagsRepo.findAll({ where: { ticketId: ticket.id } }))
        .reduce((acc: any,tag: Tag) => {
            acc[tag.categoryId] = tag.id;
            return acc;
        }, {});
        const categoriesToTagMap = req.body.taggedCategories.reduce((acc: any, ticketCategory: TicketCategory) => {
            acc[ticketCategory.id] = { ticketId: ticket.id, categoryId: ticketCategory.id };
            return acc;
        }, {});
        for (const key of Object.keys(categoriesToTagMap)) {
            if (!categoryTagsMap[key]) {
                delta.creates.push(categoriesToTagMap[key]);
            }
        }
        for (const key of Object.keys(categoryTagsMap)) {
            if (!categoriesToTagMap[key]) {
                delta.destroyIds.push(categoryTagsMap[key]);
            }
        }

        await this.categoryTagsRepo.bulkCreate(delta.creates);
        await this.categoryTagsRepo.destroy({ where: { id: delta.destroyIds } });        

        res.status(200).send();
    };

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const ticket = await this.ticketsRepo.findByPk(req.params.ticketId);
        ticket.destroy();
        res.status(200).send();
    };
}
